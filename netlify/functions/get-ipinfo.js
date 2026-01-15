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
    const { ip } = event.queryStringParameters || {};

    if (!ip) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'IP parameter is required'
        })
      };
    }

    const IPINFO_API_KEY = process.env.VITE_IPINFO_API_KEY;

    const response = await fetch(
      `https://api.ipinfo.io/lite/${ip}?token=${IPINFO_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`IPInfo API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          as_name: data.asn?.name || null,
          as_domain: data.asn?.domain || null,
          continent: data.continent?.name || null
        }
      })
    };

  } catch (error) {
    console.error('Error fetching IPInfo data:', error);

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