# Crypto Dashboard

A modern, responsive cryptocurrency dashboard built with vanilla JavaScript that provides real-time crypto data, interactive charts, and market insights.

## 🚀 Features

### 📊 Real-time Data

- Live cryptocurrency prices and market data
- 24-hour price change indicators
- Global market statistics
- Top 5 cryptocurrencies by market cap

### 📈 Interactive Charts

- **Price Chart**: 2-day price history with time-based visualization
- **Volume Chart**: 4-day trading volume data in bar chart format
- **Portfolio Chart**: Pie chart showing market cap distribution of selected cryptocurrencies

### 🎨 User Interface

- **Dark/Light Theme Toggle**: Switch between dark and light modes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Search Functionality**: Search for any cryptocurrency by name or symbol
- **Loading States**: Visual feedback during data fetching

### 🔍 Smart Search

Supports popular cryptocurrency aliases:

- BTC → Bitcoin
- ETH → Ethereum
- BNB → Binance Coin
- XRP → Ripple
- SOL → Solana
- And many more...

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Charts**: Chart.js library
- **API**: CoinGecko API for cryptocurrency data
- **HTTP Client**: Axios for API requests
- **Styling**: Custom CSS with CSS Grid and Flexbox

## 📁 Project Structure

```
crypto_new_dash_copy/
├── index.html          # Main HTML file
├── script.js           # Main JavaScript functionality
├── style.css           # Styling and themes
├── config.js           # API configuration (not tracked in git)
├── config.example.js   # Example configuration template
├── assets/             # Static assets
│   ├── night-mode.png  # Dark mode icon
│   └── sun.png         # Light mode icon
├── .gitignore          # Git ignore rules
└── README.md           # Project documentation
```

## 🚦 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for API calls and CDN resources)

### Installation

1. **Clone or download the repository**

   ```bash
   git clone <repository-url>
   cd crypto_new_dash_copy
   ```

2. **Set up API configuration**

   ```bash
   # Copy the example configuration
   cp config.example.js config.js

   # Edit config.js and add your CoinGecko API key
   # Get your free API key from: https://coingecko.com/api
   ```

3. **Open in a web server**

   - Option 1: Use Live Server extension in VS Code
   - Option 2: Use Python's built-in server:
     ```bash
     python -m http.server 8000
     ```
   - Option 3: Use Node.js http-server:
     ```bash
     npx http-server
     ```

4. **Open in browser**
   Navigate to `http://localhost:8000` (or your server's URL)

### Direct Usage

You can also open `index.html` directly in your browser, but using a local server is recommended for optimal performance.

## 💡 Usage

### Searching for Cryptocurrencies

1. Enter a cryptocurrency name or symbol in the search box
2. Click "Search" or press Enter
3. View real-time data, charts, and market information

### Theme Switching

- Click the theme toggle button in the top-right corner
- Switch between dark and light modes
- Theme preference is maintained during the session

### Chart Interactions

- **Price Chart**: Hover over data points to see exact values
- **Volume Chart**: View daily trading volumes with tooltips
- **Portfolio Chart**: See percentage distribution of market caps

## 🔌 API Integration

The dashboard uses the [CoinGecko API](https://coingecko.com/api) which provides:

- Real-time cryptocurrency prices
- Market capitalization data
- Trading volume information
- Historical price data
- Global market statistics

### API Configuration

1. **Get your API key** from [CoinGecko](https://coingecko.com/api)

   - Free tier: 30 calls/month
   - Demo tier: 10,000 calls/month

2. **Configure your API key** in `config.js`:

   ```javascript
   const getApiConfig = () => {
     return {
       baseUrl: "https://api.coingecko.com/api/v3",
       apiKey: "YOUR_API_KEY_HERE",
       useDemoKey: true,
     };
   };
   ```

3. **Important Security Note**:
   - `config.js` is excluded from git tracking
   - Never commit API keys to version control
   - Use environment variables in production

**Rate Limits**: The app uses Demo API tier with 10,000 monthly calls and respects rate limits with proper error handling.

## ⚙️ Configuration

### Supported Cryptocurrencies

The app supports all cryptocurrencies available on CoinGecko. Popular aliases are pre-configured for easy searching.

### Update Intervals

- **Portfolio Data**: Updates every 60 seconds
- **Global Market Data**: Updates every 2 minutes
- **Price Charts**: Updated on each search

### Chart Settings

- **Price History**: 2 days of data
- **Volume History**: 4 days of data
- **Time Zone**: Asia/Kolkata (IST)

## 🎨 Customization

### Themes

The dashboard includes two built-in themes:

- **Light Theme**: Clean, bright interface
- **Dark Theme**: Dark, modern interface

### Colors

Primary color scheme uses gradients:

- Main gradient: `#667eea` to `#764ba2`
- Chart colors: Teal variations (`rgb(75,192,192)`)

### Responsive Breakpoints

- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

## 🔧 Development

### Code Structure

- **DOM Elements**: Cached for performance
- **Global Variables**: Minimal global state management
- **Error Handling**: Graceful error handling with user feedback
- **Memory Management**: Proper cleanup of intervals and charts

### Security & Git Configuration

- **API Key Protection**: `config.js` is excluded from git tracking
- **Template File**: `config.example.js` provides setup instructions
- **Git Ignore**: Configured to prevent accidental API key commits

```bash
# .gitignore includes:
config.js              # API configuration with sensitive keys
.env                   # Environment variables
node_modules/          # Dependencies (if using build tools)
```

### Performance Optimizations

- Chart destruction and recreation to prevent memory leaks
- Interval management to prevent multiple timers
- Efficient DOM queries and caching

## 🐛 Troubleshooting

### Common Issues

1. **Charts not displaying**

   - Ensure Chart.js is loaded from CDN
   - Check browser console for errors
   - Verify canvas elements exist in HTML

2. **API errors**

   - Check internet connection
   - Verify CoinGecko API is accessible
   - Try different cryptocurrency names

3. **Search not working**
   - Ensure input field has valid cryptocurrency name
   - Check for typos in cryptocurrency names
   - Try using popular aliases (BTC, ETH, etc.)

### Browser Compatibility

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Maintain existing code style and structure
2. Add comments for complex functionality
3. Test on multiple browsers
4. Ensure responsive design principles

## 📞 Support

For support or questions:

1. Check the troubleshooting section
2. Review browser console for errors
3. Verify API connectivity
4. Check that all required files are present

## 🔄 Updates

### Recent Improvements

- Removed console logging for production use
- Fixed memory leaks in interval management
- Enhanced error handling
- Optimized API calls

---

**Built with ❤️ using Vanilla JavaScript and modern web technologies**
