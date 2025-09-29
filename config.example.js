// API Configuration Example
// Copy this file to config.js and add your API key

const getApiConfig = () => {
    // CoinGecko Pro API has CORS restrictions for browser use
    // Using free API endpoints which allow CORS, with Demo key for higher limits when possible
    const baseUrl = 'https://api.coingecko.com/api/v3';
    const apiKey = 'YOUR_COINGECKO_API_KEY_HERE'; // Replace with your actual API key

    return {
        baseUrl,
        apiKey,
        // Use Demo key in query params for free endpoints to get higher limits
        useDemoKey: true
    };
};

// Export configuration
window.API_CONFIG = getApiConfig();

/* 
API Key Setup Instructions:
1. Go to https://coingecko.com/api
2. Sign up for a free account
3. Get your API key from the dashboard
4. Replace 'YOUR_COINGECKO_API_KEY_HERE' with your actual key
5. Save this file as config.js (not config.example.js)

Rate Limits:
- Free: 30 calls per month
- Demo: 10,000 calls per month, 30 requests per minute
- Pro: Higher limits available

Security Note:
- config.js is ignored by git to protect your API key
- Never commit your actual API key to version control
*/