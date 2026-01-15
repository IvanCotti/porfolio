
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

    const VT_API_KEY = process.env.VITE_VIRUSTOTAL_API_KEY;
    const vtHeaders = { 'x-apikey': VT_API_KEY };

    // Hacer ambas llamadas en paralelo
    const [reportRes, resolutionsRes] = await Promise.all([
      fetch(`https://www.virustotal.com/api/v3/ip_addresses/${ip}`, {
        headers: vtHeaders
      }),
      fetch(`https://www.virustotal.com/api/v3/ip_addresses/${ip}/resolutions?limit=10`, {
        headers: vtHeaders
      })
    ]);

    if (!reportRes.ok) {
      throw new Error(`VirusTotal API error: ${reportRes.status}`);
    }

    const reportData = await reportRes.json();
    const attrs = reportData.data?.attributes || {};

    const maliciousResults = {};
    if (attrs.last_analysis_results) {
      Object.entries(attrs.last_analysis_results).forEach(([engine, result]) => {
        if (result.category !== 'undetected') {
          maliciousResults[engine] = result;
        }
      });
    }

    let processedResolutions = [];
    if (resolutionsRes.ok) {
      const resolutionsData = await resolutionsRes.json();
      if (resolutionsData.data && resolutionsData.data.length > 0) {
        processedResolutions = resolutionsData.data.map(item => ({
          id: item.id || null,
          ip_address_last_analysis_stats: item.attributes?.ip_address_last_analysis_stats || null,
          resolver: item.attributes?.resolver || null,
          host_name: item.attributes?.host_name || null
        }));
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          as_owner: attrs.as_owner || null,
          network: attrs.network || null,
          regional_internet_registry: attrs.regional_internet_registry || null,
          country: attrs.country || null,
          malicious_results: Object.keys(maliciousResults).length > 0
            ? maliciousResults
            : "Engines: Malware Undetected",
          resolutions: processedResolutions.length > 0
            ? processedResolutions
            : "Not Found"
        }
      })
    };

  } catch (error) {
    console.error('Error fetching VirusTotal data:', error);

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