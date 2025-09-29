// =================== DOM Elements ===================
const toggle_button = document.getElementById('theme_toggle');
const toggle_img = document.getElementById('theme_icon');
const toggle_text = document.getElementById('theme_text');
const coin_search = document.getElementById('searchBox');
const searchBtn = document.getElementById('searchBtn');


// =================== Global Variables ===================
let is_dark = false;
let priceChart;
let volumeChart;
let portfolioChart;
let portfolioCoins = [];
let currentSearchedCoin = null;
let globalMarketInterval = null;

// =================== THEME FUNCTIONALITY ===================
function change_theme_dark() {
    document.body.classList.add('dark-theme');
    toggle_img.src = 'assets/sun.png';
    toggle_img.alt = 'Light mode icon';
    toggle_text.innerText = "Light Mode";
    is_dark = true;
}

function change_theme_light() {
    document.body.classList.remove('dark-theme');
    toggle_img.src = 'assets/night-mode.png';
    toggle_img.alt = 'Dark mode icon';
    toggle_text.innerText = "Dark Mode";
    is_dark = false;
}

function change_theme() {
    if (is_dark) {
        change_theme_light();
    } else {
        change_theme_dark();
    }
}

// =================== FORMAT HELPERS ===================
function formatPriceINR(price) {
    return price >= 1
        ? price.toLocaleString("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 3, maximumFractionDigits: 4 })
        : "₹" + price.toFixed(8);
}

function formatNumber(market_cap) {
    if (market_cap >= 1e12) return (market_cap / 1e12).toFixed(2) + ' T';
    if (market_cap >= 1e9) return (market_cap / 1e9).toFixed(2) + ' B';
    if (market_cap >= 1e6) return (market_cap / 1e6).toFixed(2) + ' M';
    if (market_cap >= 1e3) return (market_cap / 1e3).toFixed(2) + ' K';
    return market_cap.toFixed(2);
}

// =================== API FETCHERS ===================

// API Configuration (loaded from config.js)
// Uses CoinGecko Demo API with authentication

// Market chart (prices)
async function fetchCoinMarketChart(coinId, day) {
    try {
        const config = window.API_CONFIG;
        const response = await axios.get(
            `${config.baseUrl}/coins/${coinId}/market_chart`,
            {
                params: {
                    vs_currency: 'usd',
                    days: day,
                    ...(config.useDemoKey ? { 'x_cg_demo_api_key': config.apiKey } : {})
                }
            }
        );
        return response.data.prices; // [ [timestamp, price], ... ]
    } catch (e) {
        return [];
    }
}

// Global market data
async function fetchGlobalMarketData() {
    try {
        const config = window.API_CONFIG;
        console.log('Config loaded:', config);
        console.log('API Key being used:', config.apiKey);
        console.log('Fetching global market data from:', `${config.baseUrl}/global`);

        const requestConfig = {
            headers: {
                'x-cg-demo-api-key': config.apiKey
            }
        };
        console.log('Request config:', requestConfig);

        const response = await axios.get(`${config.baseUrl}/global`, requestConfig);
        console.log('Global market data response:', response.data);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching global market data:', error);
        console.error('Error details:', error.response?.data || error.message);
        return null;
    }
}

// Detailed coin data
async function fetch_coin_data(coinId) {
    try {
        const config = window.API_CONFIG;
        const response = await axios.get(`${config.baseUrl}/coins/${coinId}`, {
            params: {
                localization: false,
                tickers: false,
                market_data: true,
                community_data: false,
                developer_data: false,
                sparkline: false,
                ...(config.useDemoKey ? { 'x_cg_demo_api_key': config.apiKey } : {})
            }
        });
        return response.data;
    } catch (error) {
        return null;
    }
}

// Volume by asset
async function fetch_volume_data(coinId) {
    try {
        const config = window.API_CONFIG;
        const response = await axios.get(`${config.baseUrl}/coins/${coinId}/market_chart`, {
            params: {
                vs_currency: 'usd',
                days: 4,
                ...(config.useDemoKey ? { 'x_cg_demo_api_key': config.apiKey } : {})
            }
        });
        return response.data;
    } catch (error) {
        return null;
    }
}

// Portfolio data
async function get_portfolio_data(coins) {
    try {
        const config = window.API_CONFIG;
        const response = await axios.get(`${config.baseUrl}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                ids: coins.join(','),
                order: 'market_cap_desc',
                per_page: 5,
                page: 1,
                sparkline: false,
                ...(config.useDemoKey ? { 'x_cg_demo_api_key': config.apiKey } : {})
            }
        });
        return response.data;
    } catch (error) {
        return [];
    }
}

// Top 5 cryptos
async function fetch_top_cryptos() {
    try {
        const config = window.API_CONFIG;
        console.log('Config in fetch_top_cryptos:', config);
        console.log('API Key in fetch_top_cryptos:', config.apiKey);
        console.log('Fetching top cryptos from:', `${config.baseUrl}/coins/markets`);

        const requestConfig = {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 5,
                page: 1,
                sparkline: false,
                ...(config.useDemoKey ? { 'x_cg_demo_api_key': config.apiKey } : {})
            }
        };
        console.log('Request config for top cryptos:', requestConfig);

        const response = await axios.get(`${config.baseUrl}/coins/markets`, requestConfig);
        const cryptos = response.data;
        console.log('Received crypto data:', cryptos);

        const table_body = document.getElementById('crypto-table-body');
        if (!table_body) {
            console.error('Table body element not found!');
            return;
        }

        table_body.innerHTML = '';
        cryptos.forEach(c => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${c.image}" alt="${c.name}" width="20"> ${c.name} (${c.symbol.toUpperCase()})</td>
                <td>$${c.current_price.toLocaleString()}</td>
                <td class="${c.price_change_percentage_24h < 0 ? 'negative' : 'positive'}">
                    ${c.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td>$${c.market_cap.toLocaleString()}</td>
                <td>$${c.total_volume.toLocaleString()}</td>
            `;
            table_body.appendChild(row);
        });
        console.log('Successfully populated crypto table');
    } catch (error) {
        console.error('Error fetching top cryptos:', error);
        console.error('Error details:', error.response?.data || error.message);
    }
}

// =================== CHART UPDATERS ===================

// Price chart
async function updatePriceChart(coinId) {
    const prices = await fetchCoinMarketChart(coinId, 2); // past 2 days
    if (!prices.length) return;

    const labels = prices.map(p =>
        new Date(p[0]).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Kolkata'
        })
    );
    const data = prices.map(p => p[1]);

    const ctx = document.getElementById('priceChart').getContext('2d');
    if (priceChart) priceChart.destroy();

    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: `${coinId.toUpperCase()} Price (USD)`,
                data,
                borderColor: 'rgb(75,192,192)',
                backgroundColor: 'rgba(75,192,192,0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Time (IST)' } },
                y: { title: { display: true, text: 'Price (USD)' } }
            }
        }
    });
}

// Volume chart
function update_volume(response, coinId) {
    try {
        const volume = response.total_volumes;
        const labels = volume.map(v => new Date(v[0]).toLocaleDateString('en-IN'));
        const data = volume.map(v => v[1]);

        const ctx = document.getElementById('Volume_chart').getContext("2d");
        if (volumeChart) volumeChart.destroy();

        volumeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: `${coinId.toUpperCase()} 4-day Volume (USD)`,
                    data,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Volume (USD)' }
                    },
                    x: { title: { display: true, text: 'Date' } }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => `$${context.raw.toLocaleString()}`
                        }
                    }
                }
            }
        });
    } catch (error) {
        // Silent error handling for volume chart update
    }
}

// Portfolio chart
async function updatePortfolioChart(searchedCoin) {
    try {
        // Always update portfolio to include the searched coin
        const otherCoins = ['bitcoin', 'ethereum', 'tether', 'ripple', 'binancecoin', 'solana'];

        // Start with searched coin as the first coin (largest slice)
        portfolioCoins = [searchedCoin];

        // Add other popular coins, but exclude the searched coin if it's already in the list
        const filtered = otherCoins.filter(c => c !== searchedCoin);

        // Add 4 more coins to make a portfolio of 5
        while (portfolioCoins.length < 5 && filtered.length > 0) {
            const randomIndex = Math.floor(Math.random() * filtered.length);
            const randomCoin = filtered[randomIndex];
            portfolioCoins.push(randomCoin);
            filtered.splice(randomIndex, 1); // Remove to avoid duplicates
        }

        const coinData = await get_portfolio_data(portfolioCoins);
        if (!coinData || coinData.length === 0) throw new Error("No coin data found");

        const totalMarketCap = coinData.reduce((sum, c) => sum + c.market_cap, 0);

        // Create labels with coin names, highlight the searched coin
        const labels = coinData.map((c, index) => {
            const symbol = c.symbol.toUpperCase();
            // Mark the searched coin (first one) with a star
            return index === 0 ? `⭐ ${symbol}` : symbol;
        });

        const data = coinData.map(c => ((c.market_cap / totalMarketCap) * 100).toFixed(2));

        // Use distinct colors, make searched coin more prominent
        const colors = ['#ff6b35', '#4caf50', '#2196f3', '#ff9800', '#9c27b0'];

        const ctx = document.getElementById('Portfoliochart').getContext("2d");
        if (portfolioChart) portfolioChart.destroy();

        portfolioChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const coinName = coinData[context.dataIndex].name;
                                return `${coinName}: ${context.raw}% (Market Cap)`;
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: `Portfolio Distribution (featuring ${coinData[0].name})`,
                        font: { size: 14 }
                    }
                }
            }
        });

    } catch (error) {
        // Silent error handling for portfolio chart creation
    }
}

// Refresh portfolio every 1 min
// this is limite to 
// setInterval(() => {
//     if (portfolioCoins.length > 0) {
//         updatePortfolioChart(portfolioCoins[0]);
//     }
// }, 60 * 1000);

// =================== UI UPDATERS ===================
function update_the_coin_ui(coinData, coinName) {
    const coinSymbol = coinData.symbol ? coinData.symbol.toUpperCase() : coinName.toUpperCase().substring(0, 4);

    Array.from(document.getElementsByClassName('coin-symbol')).forEach(el => {
        el.innerText = coinSymbol;
    });

    const CoinValue = document.getElementById('coin-price');
    if (CoinValue && coinData.market_data) {
        CoinValue.innerText = formatPriceINR(coinData.market_data.current_price.inr);
        CoinValue.classList.remove('loading');
    }

    const CoinMarketCap = document.getElementById('coin-change');
    if (CoinMarketCap && coinData.market_data) {
        const marketCapFormatted = formatNumber(coinData.market_data.market_cap.usd);
        CoinMarketCap.innerText = `Market Cap: $${marketCapFormatted}`;
    }

    const coin_indicate = document.getElementById('coin-indicator');
    if (coin_indicate && coinData.market_data) {
        let change_percent = coinData.market_data.price_change_percentage_24h || 0;
        coin_indicate.innerText = `${change_percent >= 0 ? '+' : ''}${change_percent.toFixed(2)}%`;
        coin_indicate.className = `change-indicator ${change_percent >= 0 ? 'positive' : 'negative'}`;
        coin_indicate.classList.remove('loading');
    }

    const searchCoinEl = document.getElementById('search_coin');
    if (searchCoinEl) searchCoinEl.innerText = coinSymbol;

    currentSearchedCoin = coinName;
}

function updateGlobalMarketUI(marketData) {
    if (!marketData) return;

    const totalMarketCapEl = document.getElementById('total-market-cap');
    if (totalMarketCapEl) {
        totalMarketCapEl.innerText = '$' + formatNumber(marketData.total_market_cap.usd);
        totalMarketCapEl.classList.remove('loading');
    }

    const marketChangeEl = document.getElementById('market-change');
    if (marketChangeEl) {
        marketChangeEl.innerText = `24h Volume Trade: $${formatNumber(marketData.total_volume.usd)}`;
        marketChangeEl.classList.remove('loading');
    }

    const marketIndicatorEl = document.getElementById('market-indicator');
    if (marketIndicatorEl) {
        const change = marketData.market_cap_change_percentage_24h_usd;
        marketIndicatorEl.innerText = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
        marketIndicatorEl.className = `change-indicator ${change >= 0 ? 'positive' : 'negative'}`;
        marketIndicatorEl.classList.remove('loading');
    }
}

// =================== MAIN SEARCH FUNCTION ===================
async function call_apis_from_value(coin) {
    const coinMapping = {
        'btc': 'bitcoin', 'bitcoin': 'bitcoin',
        'eth': 'ethereum', 'ethereum': 'ethereum',
        'bnb': 'binancecoin', 'binance coin': 'binancecoin',
        'xrp': 'ripple', 'ripple': 'ripple',
        'sol': 'solana', 'solana': 'solana',
        'doge': 'dogecoin', 'dogecoin': 'dogecoin',
        'ada': 'cardano', 'cardano': 'cardano',
        'dot': 'polkadot', 'polkadot': 'polkadot',
        'matic': 'matic-network', 'polygon': 'matic-network',
        'avax': 'avalanche-2', 'avalanche': 'avalanche-2',
        'shib': 'shiba-inu', 'shiba inu': 'shiba-inu',
        'trx': 'tron', 'tron': 'tron'
    };
    const coinId = coinMapping[coin] || coin;

    try {
        const coinData = await fetch_coin_data(coinId);
        const global_data = await fetchGlobalMarketData();
        const volume_by_asset = await fetch_volume_data(coinId);

        if (coinData && coinData.market_data) {
            update_the_coin_ui(coinData, coinId);
            updatePriceChart(coinId);
        }
        if (global_data) {
            updateGlobalMarketUI(global_data);
            // Clear existing interval to prevent multiple intervals
            if (globalMarketInterval) {
                clearInterval(globalMarketInterval);
            }
            // Set up global market data refresh
            globalMarketInterval = setInterval(async () => {
                const updatedData = await fetchGlobalMarketData();
                updateGlobalMarketUI(updatedData);
            }, 2 * 60 * 1000);
        }
        if (volume_by_asset) {
            update_volume(volume_by_asset, coinId);
        } else {
            throw new Error(`No data found for "${coin}"`);
        }
    } catch (error) {
        alert(`Could not find data for "${coin}". Try Bitcoin, Ethereum, Solana, etc.`);
    }
}

// =================== EVENT LISTENERS ===================
document.addEventListener("DOMContentLoaded", function () {
    toggle_button.addEventListener("click", change_theme);

    searchBtn.addEventListener("click", async function () {
        const coin = coin_search.value.toLowerCase().trim();
        if (coin === '') {
            alert("Please enter a cryptocurrency name");
            return;
        }
        searchBtn.textContent = '🔍 Searching...';
        searchBtn.disabled = true;
        try {
            await call_apis_from_value(coin);
            await updatePortfolioChart(coin);
        } catch (error) {
            // Silent error handling for search operation
        } finally {
            searchBtn.textContent = 'Search';
            searchBtn.disabled = false;
        }
    });

    coin_search.addEventListener("keypress", function (e) {
        if (e.key === "Enter") searchBtn.click();
    });

    // Initialize dashboard data
    fetch_top_cryptos();

    // Load global market data on startup
    fetchGlobalMarketData().then(data => {
        if (data) {
            updateGlobalMarketUI(data);
        }
    }).catch(error => {
        console.error('Error loading initial global market data:', error);
    });
});
