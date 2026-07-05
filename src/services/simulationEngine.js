// Comprehensive Delhi Metro Stations list covering all lines and zones of Delhi-NCR
export const MONITORING_STATIONS = [
  // ================= RED LINE (North-West to North-East) =================
  { id: 'rithala', name: 'Rithala [Red Line]', lat: 28.7207, lng: 77.1072, baseAqi: 280, industrialWeight: 0.3, trafficWeight: 0.4, dustWeight: 0.3 },
  { id: 'rohini-west', name: 'Rohini West [Red Line]', lat: 28.7155, lng: 77.1132, baseAqi: 250, industrialWeight: 0.2, trafficWeight: 0.4, dustWeight: 0.4 },
  { id: 'rohini-east', name: 'Rohini East [Red Line]', lat: 28.7132, lng: 77.1341, baseAqi: 260, industrialWeight: 0.2, trafficWeight: 0.4, dustWeight: 0.4 },
  { id: 'pitampura', name: 'Pitampura [Red Line]', lat: 28.6987, lng: 77.1386, baseAqi: 270, industrialWeight: 0.2, trafficWeight: 0.4, dustWeight: 0.4 },
  { id: 'netaji-subhash-place', name: 'Netaji Subhash Place [Red Line]', lat: 28.6896, lng: 77.1512, baseAqi: 310, industrialWeight: 0.2, trafficWeight: 0.5, dustWeight: 0.3 },
  { id: 'inderlok', name: 'Inderlok [Red Line]', lat: 28.6732, lng: 77.1646, baseAqi: 320, industrialWeight: 0.3, trafficWeight: 0.5, dustWeight: 0.2 },
  { id: 'shastri-nagar', name: 'Shastri Nagar [Red Line]', lat: 28.6692, lng: 77.1681, baseAqi: 310, industrialWeight: 0.2, trafficWeight: 0.5, dustWeight: 0.3 },
  { id: 'tis-hazari', name: 'Tis Hazari [Red Line]', lat: 28.6608, lng: 77.2185, baseAqi: 330, industrialWeight: 0.1, trafficWeight: 0.6, dustWeight: 0.3 },
  { id: 'kashmere-gate', name: 'Kashmere Gate [Red/Yellow/Violet]', lat: 28.6675, lng: 77.2282, baseAqi: 390, industrialWeight: 0.2, trafficWeight: 0.6, dustWeight: 0.2 },
  { id: 'seelampur', name: 'Seelampur [Red Line]', lat: 28.6671, lng: 77.2704, baseAqi: 380, industrialWeight: 0.4, trafficWeight: 0.4, dustWeight: 0.2 },
  { id: 'welcome', name: 'Welcome [Red/Pink]', lat: 28.6719, lng: 77.2778, baseAqi: 360, industrialWeight: 0.3, trafficWeight: 0.4, dustWeight: 0.3 },
  { id: 'shahdara', name: 'Shahdara [Red Line]', lat: 28.6734, lng: 77.2905, baseAqi: 360, industrialWeight: 0.3, trafficWeight: 0.5, dustWeight: 0.2 },
  { id: 'dilshad-garden', name: 'Dilshad Garden [Red Line]', lat: 28.6761, lng: 77.3202, baseAqi: 340, industrialWeight: 0.3, trafficWeight: 0.5, dustWeight: 0.2 },
  { id: 'shaheed-sthal', name: 'Shaheed Sthal Ghaziabad [Red Line]', lat: 28.6745, lng: 77.4475, baseAqi: 370, industrialWeight: 0.4, trafficWeight: 0.4, dustWeight: 0.2 },

  // ================= YELLOW LINE (North Delhi to Gurgaon) =================
  { id: 'samaypur-badli', name: 'Samaypur Badli [Yellow Line]', lat: 28.7455, lng: 77.1378, baseAqi: 330, industrialWeight: 0.3, trafficWeight: 0.4, dustWeight: 0.3 },
  { id: 'jahangir-puri', name: 'Jahangirpuri [Yellow Line]', lat: 28.7259, lng: 77.1661, baseAqi: 360, industrialWeight: 0.3, trafficWeight: 0.4, dustWeight: 0.3 },
  { id: 'azadpur', name: 'Azadpur [Yellow/Pink/Orange]', lat: 28.7067, lng: 77.1815, baseAqi: 330, industrialWeight: 0.3, trafficWeight: 0.5, dustWeight: 0.2 },
  { id: 'gtb-nagar', name: 'GTB Nagar [Yellow Line]', lat: 28.6972, lng: 77.2074, baseAqi: 280, industrialWeight: 0.1, trafficWeight: 0.6, dustWeight: 0.3 },
  { id: 'vishwavidyalaya', name: 'Vishwavidyalaya [Yellow Line]', lat: 28.6948, lng: 77.2081, baseAqi: 250, industrialWeight: 0.1, trafficWeight: 0.5, dustWeight: 0.4 },
  { id: 'chandni-chowk', name: 'Chandni Chowk [Yellow Line]', lat: 28.6578, lng: 77.2302, baseAqi: 350, industrialWeight: 0.1, trafficWeight: 0.7, dustWeight: 0.2 },
  { id: 'chawri-bazar', name: 'Chawri Bazar [Yellow Line]', lat: 28.6493, lng: 77.2264, baseAqi: 340, industrialWeight: 0.1, trafficWeight: 0.7, dustWeight: 0.2 },
  { id: 'new-delhi-dmrc', name: 'New Delhi [Yellow/Airport]', lat: 28.6432, lng: 77.2215, baseAqi: 345, industrialWeight: 0.2, trafficWeight: 0.6, dustWeight: 0.2 },
  { id: 'rajiv-chowk', name: 'Rajiv Chowk [Yellow/Blue]', lat: 28.6330, lng: 77.2190, baseAqi: 290, industrialWeight: 0.1, trafficWeight: 0.7, dustWeight: 0.2 },
  { id: 'patel-chowk', name: 'Patel Chowk [Yellow Line]', lat: 28.6232, lng: 77.2135, baseAqi: 270, industrialWeight: 0.1, trafficWeight: 0.6, dustWeight: 0.3 },
  { id: 'central-secretariat', name: 'Central Secretariat [Yellow/Violet]', lat: 28.6148, lng: 77.2114, baseAqi: 260, industrialWeight: 0.1, trafficWeight: 0.6, dustWeight: 0.3 },
  { id: 'ina', name: 'Dilli Haat INA [Yellow/Pink]', lat: 28.5724, lng: 77.2100, baseAqi: 260, industrialWeight: 0.1, trafficWeight: 0.6, dustWeight: 0.3 },
  { id: 'aiims', name: 'AIIMS [Yellow Line]', lat: 28.5684, lng: 77.2069, baseAqi: 260, industrialWeight: 0.1, trafficWeight: 0.6, dustWeight: 0.3 },
  { id: 'green-park', name: 'Green Park [Yellow Line]', lat: 28.5588, lng: 77.2038, baseAqi: 240, industrialWeight: 0.1, trafficWeight: 0.5, dustWeight: 0.4 },
  { id: 'hauz-khas', name: 'Hauz Khas [Yellow/Magenta]', lat: 28.5432, lng: 77.2065, baseAqi: 235, industrialWeight: 0.1, trafficWeight: 0.5, dustWeight: 0.4 },
  { id: 'malviya-nagar', name: 'Malviya Nagar [Yellow Line]', lat: 28.5268, lng: 77.2081, baseAqi: 240, industrialWeight: 0.1, trafficWeight: 0.5, dustWeight: 0.4 },
  { id: 'saket', name: 'Saket [Yellow Line]', lat: 28.5222, lng: 77.2061, baseAqi: 250, industrialWeight: 0.1, trafficWeight: 0.5, dustWeight: 0.4 },
  { id: 'chattarpur', name: 'Chattarpur [Yellow Line]', lat: 28.5020, lng: 77.1350, baseAqi: 260, industrialWeight: 0.1, trafficWeight: 0.5, dustWeight: 0.4 },
  { id: 'mg-road', name: 'MG Road Gurugram [Yellow Line]', lat: 28.4802, lng: 77.0803, baseAqi: 260, industrialWeight: 0.2, trafficWeight: 0.5, dustWeight: 0.3 },
  { id: 'sikanderpur', name: 'Sikanderpur Gurugram [Yellow/Rapid]', lat: 28.4905, lng: 77.0903, baseAqi: 270, industrialWeight: 0.2, trafficWeight: 0.5, dustWeight: 0.3 },
  { id: 'iffco-chowk', name: 'IFFCO Chowk Gurugram [Yellow Line]', lat: 28.4712, lng: 77.0725, baseAqi: 280, industrialWeight: 0.2, trafficWeight: 0.5, dustWeight: 0.3 },
  { id: 'huda-city-center', name: 'Millennium City Centre Gurugram [Yellow]', lat: 28.4593, lng: 77.0724, baseAqi: 265, industrialWeight: 0.2, trafficWeight: 0.5, dustWeight: 0.3 },

  // ================= BLUE LINE (West Delhi to Noida / Vaishali) =================
  { id: 'dwarka-sec-21', name: 'Dwarka Sec 21 [Blue/Airport]', lat: 28.5522, lng: 77.0581, baseAqi: 240, industrialWeight: 0.1, trafficWeight: 0.4, dustWeight: 0.5 },
  { id: 'dwarka-mor', name: 'Dwarka Mor [Blue Line]', lat: 28.6185, lng: 77.0322, baseAqi: 310, industrialWeight: 0.2, trafficWeight: 0.4, dustWeight: 0.4 },
  { id: 'nawada', name: 'Nawada [Blue Line]', lat: 28.6212, lng: 77.0503, baseAqi: 300, industrialWeight: 0.2, trafficWeight: 0.4, dustWeight: 0.4 },
  { id: 'uttam-nagar-west', name: 'Uttam Nagar West [Blue Line]', lat: 28.6241, lng: 77.0652, baseAqi: 320, industrialWeight: 0.2, trafficWeight: 0.4, dustWeight: 0.4 },
  { id: 'uttam-nagar-east', name: 'Uttam Nagar East [Blue Line]', lat: 28.6234, lng: 77.0753, baseAqi: 320, industrialWeight: 0.2, trafficWeight: 0.4, dustWeight: 0.4 },
  { id: 'janakpuri-west', name: 'Janakpuri West [Blue/Magenta]', lat: 28.6293, lng: 77.0784, baseAqi: 280, industrialWeight: 0.2, trafficWeight: 0.5, dustWeight: 0.3 },
  { id: 'janakpuri-east', name: 'Janakpuri East [Blue Line]', lat: 28.6294, lng: 77.0932, baseAqi: 280, industrialWeight: 0.2, trafficWeight: 0.5, dustWeight: 0.3 },
  { id: 'tilak-nagar', name: 'Tilak Nagar [Blue Line]', lat: 28.6302, lng: 77.0964, baseAqi: 290, industrialWeight: 0.2, trafficWeight: 0.5, dustWeight: 0.3 },
  { id: 'subhash-nagar', name: 'Subhash Nagar [Blue Line]', lat: 28.6405, lng: 77.1042, baseAqi: 295, industrialWeight: 0.2, trafficWeight: 0.5, dustWeight: 0.3 },
  { id: 'tagore-garden', name: 'Tagore Garden [Blue Line]', lat: 28.6432, lng: 77.1112, baseAqi: 270, industrialWeight: 0.1, trafficWeight: 0.5, dustWeight: 0.4 },
  { id: 'rajouri-garden', name: 'Rajouri Garden [Blue/Pink]', lat: 28.6484, lng: 77.1235, baseAqi: 310, industrialWeight: 0.1, trafficWeight: 0.6, dustWeight: 0.3 },
  { id: 'moti-nagar', name: 'Moti Nagar [Blue Line]', lat: 28.6572, lng: 77.1424, baseAqi: 320, industrialWeight: 0.2, trafficWeight: 0.5, dustWeight: 0.3 },
  { id: 'shadipur', name: 'Shadipur [Blue Line]', lat: 28.6515, lng: 77.1554, baseAqi: 330, industrialWeight: 0.3, trafficWeight: 0.4, dustWeight: 0.3 },
  { id: 'patel-nagar', name: 'Patel Nagar [Blue Line]', lat: 28.6535, lng: 77.1654, baseAqi: 300, industrialWeight: 0.2, trafficWeight: 0.5, dustWeight: 0.3 },
  { id: 'rajendra-place', name: 'Rajendra Place [Blue Line]', lat: 28.6425, lng: 77.1781, baseAqi: 285, industrialWeight: 0.1, trafficWeight: 0.6, dustWeight: 0.3 },
  { id: 'karol-bagh', name: 'Karol Bagh [Blue Line]', lat: 28.6444, lng: 77.1895, baseAqi: 340, industrialWeight: 0.1, trafficWeight: 0.7, dustWeight: 0.2 },
  { id: 'jhandewalan', name: 'Jhandewalan [Blue Line]', lat: 28.6441, lng: 77.1993, baseAqi: 320, industrialWeight: 0.1, trafficWeight: 0.6, dustWeight: 0.3 },
  { id: 'r-k-ashram-marg', name: 'R K Ashram Marg [Blue Line]', lat: 28.6392, lng: 77.2082, baseAqi: 330, industrialWeight: 0.1, trafficWeight: 0.6, dustWeight: 0.3 },
  { id: 'barakhamba-road', name: 'Barakhamba Road [Blue Line]', lat: 28.6304, lng: 77.2282, baseAqi: 280, industrialWeight: 0.1, trafficWeight: 0.6, dustWeight: 0.3 },
  { id: 'pragati-maidan', name: 'Supreme Court (Pragati Maidan) [Blue]', lat: 28.6254, lng: 77.2435, baseAqi: 290, industrialWeight: 0.1, trafficWeight: 0.6, dustWeight: 0.3 },
  
  // Blue Line East (Laxmi Nagar to Vaishali/Noida)
  { id: 'laxmi-nagar', name: 'Laxmi Nagar [Blue Line]', lat: 28.6304, lng: 77.2772, baseAqi: 360, industrialWeight: 0.2, trafficWeight: 0.6, dustWeight: 0.2 },
  { id: 'nirman-vihar', name: 'Nirman Vihar [Blue Line]', lat: 28.6372, lng: 77.2852, baseAqi: 340, industrialWeight: 0.2, trafficWeight: 0.5, dustWeight: 0.3 },
  { id: 'preet-vihar', name: 'Preet Vihar [Blue Line]', lat: 28.6402, lng: 77.2962, baseAqi: 330, industrialWeight: 0.2, trafficWeight: 0.5, dustWeight: 0.3 },
  { id: 'anand-vihar', name: 'Anand Vihar ISBT [Blue/Pink]', lat: 28.6476, lng: 77.3158, baseAqi: 410, industrialWeight: 0.3, trafficWeight: 0.5, dustWeight: 0.2 },
  { id: 'kaushambi', name: 'Kaushambi Ghaziabad [Blue Line]', lat: 28.6455, lng: 77.3242, baseAqi: 370, industrialWeight: 0.4, trafficWeight: 0.4, dustWeight: 0.2 },
  { id: 'vaishali', name: 'Vaishali Ghaziabad [Blue Line]', lat: 28.6502, lng: 77.3372, baseAqi: 360, industrialWeight: 0.3, trafficWeight: 0.4, dustWeight: 0.3 },
  
  { id: 'akshardham', name: 'Akshardham [Blue Line]', lat: 28.6182, lng: 77.2792, baseAqi: 300, industrialWeight: 0.1, trafficWeight: 0.6, dustWeight: 0.3 },
  { id: 'mayur-vihar-phase-1', name: 'Mayur Vihar Phase 1 [Blue/Pink]', lat: 28.6042, lng: 77.2912, baseAqi: 290, industrialWeight: 0.1, trafficWeight: 0.6, dustWeight: 0.3 },
  { id: 'new-ashok-nagar', name: 'New Ashok Nagar [Blue Line]', lat: 28.5892, lng: 77.3022, baseAqi: 310, industrialWeight: 0.2, trafficWeight: 0.5, dustWeight: 0.3 },
  { id: 'noida-sector-15', name: 'Noida Sector 15 [Blue Line]', lat: 28.5832, lng: 77.3142, baseAqi: 310, industrialWeight: 0.3, trafficWeight: 0.4, dustWeight: 0.3 },
  { id: 'noida-sec-16', name: 'Noida Sector 16 [Blue Line]', lat: 28.5782, lng: 77.3182, baseAqi: 290, industrialWeight: 0.3, trafficWeight: 0.4, dustWeight: 0.3 },
  { id: 'noida-sector-18', name: 'Noida Sector 18 [Blue Line]', lat: 28.5702, lng: 77.3262, baseAqi: 320, industrialWeight: 0.3, trafficWeight: 0.5, dustWeight: 0.2 },
  { id: 'botanical-garden', name: 'Botanical Garden Noida [Blue/Magenta]', lat: 28.5642, lng: 77.3342, baseAqi: 300, industrialWeight: 0.2, trafficWeight: 0.5, dustWeight: 0.3 },
  { id: 'noida-city-centre', name: 'Noida City Centre [Blue Line]', lat: 28.5742, lng: 77.3562, baseAqi: 310, industrialWeight: 0.2, trafficWeight: 0.5, dustWeight: 0.3 },

  // ================= VIOLET LINE (Central to Faridabad) =================
  { id: 'govindpuri', name: 'Govindpuri [Violet Line]', lat: 28.5448, lng: 77.2644, baseAqi: 340, industrialWeight: 0.4, trafficWeight: 0.4, dustWeight: 0.2 },
  { id: 'nehru-place', name: 'Nehru Place [Violet Line]', lat: 28.5512, lng: 77.2515, baseAqi: 290, industrialWeight: 0.1, trafficWeight: 0.6, dustWeight: 0.3 },
  { id: 'badarpur', name: 'Badarpur Border [Violet Line]', lat: 28.5041, lng: 77.3005, baseAqi: 370, industrialWeight: 0.5, trafficWeight: 0.3, dustWeight: 0.2 },
  { id: 'escorts-mujesar', name: 'Faridabad Escorts Mujesar [Violet Line]', lat: 28.3742, lng: 77.3121, baseAqi: 330, industrialWeight: 0.4, trafficWeight: 0.4, dustWeight: 0.2 },
  
  // ================= GREEN LINE (West Delhi to Bahadurgarh) =================
  { id: 'nangloi', name: 'Nangloi [Green Line]', lat: 28.6832, lng: 77.0642, baseAqi: 390, industrialWeight: 0.4, trafficWeight: 0.3, dustWeight: 0.3 },
  { id: 'hoshiar-singh', name: 'Bahadurgarh Brig. Hoshiar Singh [Green Line]', lat: 28.6854, lng: 76.9248, baseAqi: 220, industrialWeight: 0.2, trafficWeight: 0.4, dustWeight: 0.4 },

  // ================= AIRPORT EXPRESS LINE =================
  { id: 'shivaji-stadium', name: 'Shivaji Stadium [Airport Express]', lat: 28.6295, lng: 77.2148, baseAqi: 270, industrialWeight: 0.1, trafficWeight: 0.6, dustWeight: 0.3 },
  { id: 'dhaula-kuan', name: 'Dhaula Kuan [Airport Express]', lat: 28.5912, lng: 77.1612, baseAqi: 320, industrialWeight: 0.1, trafficWeight: 0.7, dustWeight: 0.2 },
  { id: 'delhi-aerocity', name: 'Delhi Aerocity [Airport Express]', lat: 28.5542, lng: 77.1235, baseAqi: 250, industrialWeight: 0.1, trafficWeight: 0.5, dustWeight: 0.4 },
  { id: 'igi-airport', name: 'IGI Airport Terminal 3 [Airport Express]', lat: 28.5572, lng: 77.0862, baseAqi: 230, industrialWeight: 0.1, trafficWeight: 0.4, dustWeight: 0.5 }
];

// Simulated Stubble Burning Fires (Punjab & Haryana borders)
export const STUBBLE_FIRE_HOTSPOTS = [
  { id: 'f1', name: 'Amritsar Regional Cluster', lat: 31.6340, lng: 74.8723, count: 120, intensity: 'High' },
  { id: 'f2', name: 'Tarn Taran Active Fields', lat: 31.4520, lng: 74.9220, count: 95, intensity: 'High' },
  { id: 'f3', name: 'Patiala Harvesting Zone', lat: 30.3398, lng: 76.3869, count: 65, intensity: 'Medium' },
  { id: 'f4', name: 'Karnal Stubble Burning', lat: 29.6857, lng: 76.9905, count: 45, intensity: 'Medium' },
  { id: 'f5', name: 'Hisar Cleared Fields', lat: 29.1492, lng: 75.7217, count: 30, intensity: 'Low' }
];

// Helper to simulate AQI & meteorological variables dynamically
export function generateLiveMetrics(stationId, hourOffset = 0, activeInterventions = {}) {
  const station = MONITORING_STATIONS.find(s => s.id === stationId) || MONITORING_STATIONS[0];
  
  // 1. Base Diurnal (daily) cycle: pollution peaks in morning (8 AM - 10 AM) and evening (6 PM - 10 PM)
  const currentHour = (new Date().getHours() + hourOffset) % 24;
  let diurnalFactor = 1.0;
  if (currentHour >= 7 && currentHour <= 10) diurnalFactor = 1.25; // Morning rush
  else if (currentHour >= 18 && currentHour <= 22) diurnalFactor = 1.35; // Evening cooling/traffic
  else if (currentHour >= 13 && currentHour <= 16) diurnalFactor = 0.85; // Sunny afternoon (better dispersion)

  // 2. Weather conditions
  // Wind Speed dispersion effect: Higher wind speed blows away pollution
  const baseWindSpeed = 12; // km/h
  const weatherOffset = Math.sin((new Date().getTime() / 1000000) + hourOffset) * 4;
  const windSpeed = Math.max(3, Math.round(baseWindSpeed + weatherOffset));
  const windDispersionFactor = 15 / (windSpeed + 3); // Lower speed = higher pollution multiplier

  // Wind direction: North-West (NW) brings stubble smoke, East (E) is cleaner
  const windDirectionDegrees = Math.round((315 + (Math.sin(hourOffset / 5) * 45)) % 360);
  const isNWWind = windDirectionDegrees >= 270 && windDirectionDegrees <= 330;
  const stubbleSmokeContribution = isNWWind ? 70 : 15;

  // Temperature inversion (colder winter nights trap pollution)
  const temp = Math.round(24 + Math.sin((currentHour - 14) * Math.PI / 12) * 6);
  const tempInversionFactor = temp < 18 ? 1.2 : 0.95;

  // 3. Compute baseline AQI before policies
  let rawAqi = station.baseAqi * diurnalFactor * windDispersionFactor * tempInversionFactor;
  
  // Add stubble burning contribution (depending on active fires)
  const activeFireCount = STUBBLE_FIRE_HOTSPOTS.reduce((acc, f) => acc + f.count, 0);
  const stubbleAqiAddition = (activeFireCount / 350) * stubbleSmokeContribution;
  rawAqi += stubbleAqiAddition;

  // 4. Apply Policy Interventions (reduction fractions)
  let vehicularReduction = 0;
  let industrialReduction = 0;
  let dustReduction = 0;
  let stubbleReduction = 0;

  if (activeInterventions.oddEven) {
    // Odd-Even reduces traffic emissions
    vehicularReduction = 0.35; // 35% reduction in traffic weight
  }
  if (activeInterventions.constructionHalt) {
    // Halting construction reduces dust
    dustReduction = 0.50; // 50% reduction in dust
  }
  if (activeInterventions.industrialRestriction) {
    // Shutting coal plants/brick kilns
    industrialReduction = 0.40; // 40% reduction in industry
  }
  if (activeInterventions.stubbleEnforcement) {
    // Strict penalties or bio-decomposers in Punjab/Haryana
    stubbleReduction = 0.65; // 65% reduction in stubble smoke
  }

  // Calculate customized reductions based on station profile
  const trafficImpact = rawAqi * station.trafficWeight * vehicularReduction;
  const industrialImpact = rawAqi * station.industrialWeight * industrialReduction;
  const dustImpact = rawAqi * station.dustWeight * dustReduction;
  const stubbleImpact = stubbleAqiAddition * stubbleReduction;

  const totalReduction = trafficImpact + industrialImpact + dustImpact + stubbleImpact;
  let finalAqi = Math.max(30, Math.round(rawAqi - totalReduction));

  // If firecracker ban is NOT enforced on a festival night (e.g. Diwali simulated trigger)
  // we add a massive temporary spike (not active in standard hourly unless specified)
  if (activeInterventions.firecrackerBan === false && currentHour >= 20 && currentHour <= 23) {
    finalAqi += 250;
  }

  // 5. Calculate individual pollutants based on AQI structure
  const pm25 = Math.round(finalAqi * 0.72);
  const pm10 = Math.round(finalAqi * 1.25);
  const no2 = Math.round(35 + (finalAqi * 0.15));
  const so2 = Math.round(8 + (finalAqi * 0.04));
  const co = Number((0.5 + (finalAqi * 0.005)).toFixed(1));
  const o3 = Math.round(20 + (finalAqi * 0.08));

  // Determine AQI category and colors (glowing gradients)
  let category = 'Good';
  let colorClass = 'aqi-good';
  let healthAdvice = 'Air quality is satisfactory. Outdoor activities are safe.';

  if (finalAqi > 50 && finalAqi <= 100) {
    category = 'Satisfactory';
    colorClass = 'aqi-satisfactory';
    healthAdvice = 'Minor breathing discomfort to sensitive people.';
  } else if (finalAqi > 100 && finalAqi <= 200) {
    category = 'Moderate';
    colorClass = 'aqi-moderate';
    healthAdvice = 'Breathing discomfort to people with lungs, asthma and heart diseases.';
  } else if (finalAqi > 200 && finalAqi <= 300) {
    category = 'Poor';
    colorClass = 'aqi-poor';
    healthAdvice = 'Breathing discomfort to most people on prolonged exposure.';
  } else if (finalAqi > 300 && finalAqi <= 400) {
    category = 'Very Poor';
    colorClass = 'aqi-very-poor';
    healthAdvice = 'Respiratory illness to people on prolonged exposure. Asthmatics carry inhalers.';
  } else if (finalAqi > 400) {
    category = 'Severe';
    colorClass = 'aqi-severe';
    healthAdvice = 'Serious respiratory impact on everyone. Avoid physical outdoor activities.';
  }

  // Source contribution percentages
  const totalWeight = station.trafficWeight + station.industrialWeight + station.dustWeight + (isNWWind ? 0.4 : 0.1);
  const srcVehicular = Math.round(((station.trafficWeight * (1 - vehicularReduction)) / totalWeight) * 100);
  const srcIndustrial = Math.round(((station.industrialWeight * (1 - industrialReduction)) / totalWeight) * 100);
  const srcDust = Math.round(((station.dustWeight * (1 - dustReduction)) / totalWeight) * 100);
  const srcStubble = Math.round((((isNWWind ? 0.4 : 0.1) * (1 - stubbleReduction)) / totalWeight) * 100);

  // Normalize contributions to sum to 100%
  const sumSrc = srcVehicular + srcIndustrial + srcDust + srcStubble;
  const normalizedStubble = Math.round(srcStubble + (100 - sumSrc));

  return {
    aqi: finalAqi,
    category,
    colorClass,
    healthAdvice,
    pollutants: { pm25, pm10, no2, so2, co, o3 },
    weather: {
      temperature: temp,
      humidity: Math.round(65 - Math.sin((currentHour - 6) * Math.PI / 12) * 20),
      windSpeed,
      windDirection: windDirectionDegrees <= 45 || windDirectionDegrees > 315 ? 'North' :
                     windDirectionDegrees <= 135 ? 'East' :
                     windDirectionDegrees <= 225 ? 'South' : 'West'
    },
    sources: [
      { name: 'Vehicular Emissions', value: srcVehicular },
      { name: 'Industrial Smoke', value: srcIndustrial },
      { name: 'Road & Construction Dust', value: srcDust },
      { name: 'Crop Stubble Burning', value: normalizedStubble }
    ],
    stubbleFires: isNWWind ? Math.round(activeFireCount * (1 - stubbleReduction)) : 0
  };
}
