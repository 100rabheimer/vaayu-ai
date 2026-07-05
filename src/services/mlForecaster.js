import { generateLiveMetrics } from './simulationEngine';

// Generates 24-hour forecasting trend data
// Comparing "Current Policy Path" vs "No Interventions Path"
export function generateForecastData(stationId, activeInterventions = {}) {
  const data = [];
  const startHour = new Date().getHours();
  
  for (let i = 0; i < 24; i++) {
    const targetHour = (startHour + i) % 24;
    
    // 1. Calculate AQI with currently active interventions
    const controlledMetrics = generateLiveMetrics(stationId, i, activeInterventions);
    
    // 2. Calculate baseline AQI without ANY interventions
    const uncontrolledMetrics = generateLiveMetrics(stationId, i, {});
    
    // Format hour label (e.g. "09:00 AM" or "06:00 PM")
    const period = targetHour >= 12 ? 'PM' : 'AM';
    const displayHour = targetHour % 12 === 0 ? 12 : targetHour % 12;
    const timeLabel = `${displayHour.toString().padStart(2, '0')}:00 ${period}`;
    
    data.push({
      time: timeLabel,
      aqi: controlledMetrics.aqi,
      aqiUncontrolled: uncontrolledMetrics.aqi,
      windSpeed: controlledMetrics.weather.windSpeed,
      windDirection: controlledMetrics.weather.windDirection,
      temperature: controlledMetrics.weather.temperature
    });
  }
  
  return data;
}

// Generates 6-month seasonal trend predictions (September to February)
// Models typical autumn harvesting fires and winter cold inversion layers
export function generateSeasonalData(stationId, activeInterventions = {}) {
  const months = [
    { name: 'Sep', baseAqi: 120, stubbleWeight: 0.05, inversionWeight: 0.1 },
    { name: 'Oct', baseAqi: 230, stubbleWeight: 0.40, inversionWeight: 0.2 },
    { name: 'Nov', baseAqi: 410, stubbleWeight: 0.85, inversionWeight: 0.5 },
    { name: 'Dec', baseAqi: 380, stubbleWeight: 0.30, inversionWeight: 0.9 },
    { name: 'Jan', baseAqi: 340, stubbleWeight: 0.15, inversionWeight: 0.95 },
    { name: 'Feb', baseAqi: 180, stubbleWeight: 0.05, inversionWeight: 0.4 }
  ];

  // Apply policy sandbox reduction multipliers
  const vehicleRed = activeInterventions.oddEven ? 0.12 : 0;
  const dustRed = activeInterventions.constructionHalt ? 0.15 : 0;
  const indRed = activeInterventions.industrialRestriction ? 0.18 : 0;
  const stubbleRed = activeInterventions.stubbleEnforcement ? 0.45 : 0;

  const totalGeneralReduction = vehicleRed + dustRed + indRed;

  return months.map(m => {
    // Uncontrolled baseline (with full crop burning smoke & cold air trap)
    const stubbleSpike = m.stubbleWeight * 150;
    const inversionSpike = m.inversionWeight * 110;
    const rawAqi = m.baseAqi + stubbleSpike + inversionSpike;

    // Controlled path (applies active interventions to base and stubble parts)
    const controlledStubbleSpike = stubbleSpike * (1 - stubbleRed);
    const controlledBase = m.baseAqi * (1 - totalGeneralReduction);
    const finalControlled = Math.max(30, Math.round(controlledBase + controlledStubbleSpike + inversionSpike * 0.92));

    return {
      time: m.name,
      aqi: finalControlled,
      aqiUncontrolled: Math.round(rawAqi)
    };
  });
}

// Generate AI Recommendation feedback based on current trends and weather
export function generateAiRecommendations(stationName, metrics, activeInterventions = {}) {
  const recommendations = [];
  const weather = metrics.weather;
  const isNWWind = weather.windDirection === 'West' || weather.windDirection === 'North'; // NW simulation mapping

  // Base checks
  if (metrics.aqi > 300) {
    recommendations.push({
      type: 'critical',
      title: 'Emergency GRAP Stage 4 Activation',
      desc: `AQI in ${stationName} is critical (${metrics.aqi}). Enact ban on heavy diesel vehicles and shift school classes online.`
    });
  }

  if (isNWWind && metrics.stubbleFires > 0 && !activeInterventions.stubbleEnforcement) {
    recommendations.push({
      type: 'warning',
      title: 'Favorable Stubble Transport Wind',
      desc: `Wind is blowing from the North-West (${weather.windSpeed} km/h) transport corridor. Activating crop residue management in Punjab/Haryana is highly recommended to prevent a 70+ AQI increase in Delhi.`
    });
  }

  if (metrics.pollutants.pm10 > 250 && !activeInterventions.constructionHalt) {
    recommendations.push({
      type: 'info',
      title: 'Construction & Road Dust Abatement',
      desc: `PM10 levels are highly elevated (${metrics.pollutants.pm10} µg/m³). Deploy mechanical sweepers and double water-sprinkling frequencies across high-traffic junctions.`
    });
  }

  if (metrics.pollutants.no2 > 80 && !activeInterventions.oddEven) {
    recommendations.push({
      type: 'info',
      title: 'Vehicular Emission Hotspot Detect',
      desc: `NO2 emissions (${metrics.pollutants.no2} µg/m³) suggest traffic bottlenecks. Recommend implementing vehicular restrictions (Odd-Even) or promoting remote work.`
    });
  }

  // Default fallback if air is relatively clean
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'success',
      title: 'System Stable',
      desc: 'Pollutant dispersion is optimal due to favorable wind speeds. Continue routine monitoring.'
    });
  }

  return recommendations;
}
