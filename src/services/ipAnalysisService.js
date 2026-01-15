// Servicio para análisis de IP
const API_BASE = 'http://localhost:8888/.netlify/functions'
// const API_BASE = '/.netlify/functions'

async function handleResponse(response) {
  const contentType = response.headers.get('content-type');

  // Verificar si la respuesta es JSON
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response:', text);
    throw new Error('Server returned non-JSON response. Functions may not be deployed.');
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  if (!result.success) {
    throw new Error(result.error || 'Unknown error from server');
  }

  return result.data;
}

export async function getIpData() {
  try {
    const response = await fetch(`${API_BASE}/get-ip-data`);
    return await handleResponse(response);
  } catch (error) {
    console.error('getIpData error:', error);
    throw new Error(`Failed to fetch IP data: ${error.message}`);
  }
}

export async function getIpInfo(ip) {
  try {
    const response = await fetch(`${API_BASE}/get-ipinfo?ip=${encodeURIComponent(ip)}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('getIpInfo error:', error);
    throw new Error(`Failed to fetch IPInfo data: ${error.message}`);
  }
}

export async function getVirusTotalReport(ip) {
  try {
    const response = await fetch(`${API_BASE}/virustotal-report?ip=${encodeURIComponent(ip)}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('getVirusTotalReport error:', error);
    throw new Error(`Failed to fetch VirusTotal data: ${error.message}`);
  }
}

export async function analyzeIP() {
  try {
    console.log('Starting IP analysis...');

    // 1. Obtener datos básicos de IP
    console.log('Fetching IP data...');
    const ipData = await getIpData();
    console.log('IP data received:', ipData);

    // 2. Obtener datos de IPInfo y VirusTotal en paralelo
    console.log('Fetching IPInfo and VirusTotal data...');
    const [ipinfoData, vtData] = await Promise.all([
      getIpInfo(ipData.ip),
      getVirusTotalReport(ipData.ip)
    ]);
    console.log('IPInfo data:', ipinfoData);
    console.log('VirusTotal data:', vtData);

    // 3. Construir objeto de resultados
    const results = {
      created_at: new Date().toISOString(),
      ip_address: ipData.ip,
      owner: vtData.as_owner || ipinfoData.as_name,
      domain: ipinfoData.as_domain || null,
      network: vtData.network || null,
      regional_internet_registry: vtData.regional_internet_registry || null,
      country_code: vtData.country || 'Unknown',
      location_coords: [ipData.longitude, ipData.latitude],
      location_trace: `${ipData.city}, ${ipData.country_name} ${ipinfoData.continent ? `, ${ipinfoData.continent}` : ''}`,
      malicious_results: vtData.malicious_results,
      resolutions: vtData.resolutions
    };

    console.log('Analysis complete:', results);
    return results;

  } catch (error) {
    console.error('Error in IP analysis:', error);
    throw error;
  }
}