// Función para obtener datos de IP usando ipify + ip-api (más generosos)
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    // Opción 1: Usar ipify para obtener la IP (ilimitado)
    const ipResponse = await fetch('https://api.ipify.org?format=json');

    if (!ipResponse.ok) {
      throw new Error(`IP fetch error: ${ipResponse.status}`);
    }

    const { ip } = await ipResponse.json();

    // Opción 2: Usar ip-api.com para geo data (150 requests/min - gratis)
    const geoResponse = await fetch(`http://ip-api.com/json/${ip}`);

    if (!geoResponse.ok) {
      throw new Error(`Geo API error: ${geoResponse.status}`);
    }

    const geoData = await geoResponse.json();

    if (geoData.status === 'fail') {
      throw new Error(geoData.message || 'Geo location failed');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          ip: ip,
          city: geoData.city || 'Unknown',
          country_name: geoData.country || 'Unknown',
          latitude: geoData.lat || 0,
          longitude: geoData.lon || 0
        }
      })
    };

  } catch (error) {
    console.error('Error fetching IP data:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};