/**
 * Real-Time API Ingestion Service for VaayuAI
 * Connects to public air quality feeds (e.g. OpenAQ) and falls back to simulation engine.
 */
import { generateLiveMetrics } from './simulationEngine';

// Helper to calculate Indian standard AQI from PM2.5 concentrations (simplified break-points)
export function calculateAqiFromPm25(pm25) {
  if (pm25 <= 30) return Math.round((pm25 / 30) * 50);
  if (pm25 <= 60) return Math.round(50 + ((pm25 - 30) / 30) * 50);
  if (pm25 <= 90) return Math.round(100 + ((pm25 - 60) / 30) * 100);
  if (pm25 <= 120) return Math.round(200 + ((pm25 - 90) / 30) * 100);
  if (pm25 <= 250) return Math.round(300 + ((pm25 - 120) / 130) * 100);
  return Math.round(400 + ((pm25 - 250) / 100) * 100);
}

export async function fetchLiveAqiData(stationId) {
  try {
    // 1. Fetch latest Delhi air quality stats from OpenAQ open endpoint
    const response = await fetch('https://api.openaq.org/v2/latest?city=Delhi&limit=100', {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`OpenAQ responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error('No results received from OpenAQ');
    }

    // 2. Identify the target station name (clean)
    const targetCleanName = stationId.replace(/-/g, ' '); // e.g. "anand-vihar" -> "anand vihar"

    // 3. Find closest matched location in OpenAQ feed
    const match = data.results.find(item => 
      item.location.toLowerCase().includes(targetCleanName) ||
      targetCleanName.includes(item.location.toLowerCase())
    );

    if (!match) {
      // Graceful fallback to simulator if no matching station in active OpenAQ feed
      console.log(`No active OpenAQ feed match for ${stationId}. Falling back to simulation engine.`);
      return generateLiveMetrics(stationId, 0, {});
    }

    // 4. Extract pollutants values
    let pm25Val = 0;
    let pm10Val = 0;
    let no2Val = 0;
    let so2Val = 0;
    let coVal = 0.5;
    let o3Val = 20;

    match.measurements.forEach(m => {
      if (m.parameter === 'pm25') pm25Val = Math.round(m.value);
      else if (m.parameter === 'pm10') pm10Val = Math.round(m.value);
      else if (m.parameter === 'no2') no2Val = Math.round(m.value);
      else if (m.parameter === 'so2') so2Val = Math.round(m.value);
      else if (m.parameter === 'co') coVal = Number(m.value.toFixed(1));
      else if (m.parameter === 'o3') o3Val = Math.round(m.value);
    });

    // Compute live AQI based on PM2.5 or fall back to standard value
    const liveAqi = pm25Val > 0 ? calculateAqiFromPm25(pm25Val) : Math.round(pm10Val * 0.8 || 220);

    // Determine category based on AQI
    let category = 'Good';
    let colorClass = 'aqi-good';
    let healthAdvice = 'Air quality is satisfactory. Outdoor activities are safe.';

    if (liveAqi > 50 && liveAqi <= 100) {
      category = 'Satisfactory';
      colorClass = 'aqi-satisfactory';
      healthAdvice = 'Minor breathing discomfort to sensitive people.';
    } else if (liveAqi > 100 && liveAqi <= 200) {
      category = 'Moderate';
      colorClass = 'aqi-moderate';
      healthAdvice = 'Breathing discomfort to people with lungs, asthma and heart diseases.';
    } else if (liveAqi > 200 && liveAqi <= 300) {
      category = 'Poor';
      colorClass = 'aqi-poor';
      healthAdvice = 'Breathing discomfort to most people on prolonged exposure.';
    } else if (liveAqi > 300 && liveAqi <= 400) {
      category = 'Very Poor';
      colorClass = 'aqi-very-poor';
      healthAdvice = 'Respiratory illness to people on prolonged exposure. Asthmatics carry inhalers.';
    } else if (liveAqi > 400) {
      category = 'Severe';
      colorClass = 'aqi-severe';
      healthAdvice = 'Serious respiratory impact on everyone. Avoid physical outdoor activities.';
    }

    return {
      aqi: liveAqi,
      category,
      colorClass,
      healthAdvice,
      pollutants: {
        pm25: pm25Val || Math.round(liveAqi * 0.72),
        pm10: pm10Val || Math.round(liveAqi * 1.25),
        no2: no2Val || 35,
        so2: so2Val || 8,
        co: coVal || 0.8,
        o3: o3Val || 25
      },
      weather: {
        temperature: 28,
        humidity: 62,
        windSpeed: 10,
        windDirection: 'West'
      },
      sources: [
        { name: 'Vehicular Emissions', value: 38 },
        { name: 'Industrial Smoke', value: 24 },
        { name: 'Road & Construction Dust', value: 22 },
        { name: 'Crop Stubble Burning', value: 16 }
      ],
      stubbleFires: 140, // Static estimation for real-time feed
      isRealTime: true
    };

  } catch (error) {
    // Graceful fallback to simulator on fetch error
    console.warn('Failed to fetch real-time air quality data. Falling back to simulation.', error);
    const simulated = generateLiveMetrics(stationId, 0, {});
    simulated.isRealTime = false;
    simulated.error = error.message;
    return simulated;
  }
}
