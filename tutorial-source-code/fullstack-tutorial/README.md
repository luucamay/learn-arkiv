# Arkiv Fullstack Tutorial

This tutorial demonstrates how to build a real-time cryptocurrency dashboard using the Arkiv Network. The application consists of a Node.js backend that fetches cryptocurrency data and stores it on Arkiv, and a frontend that displays this data in real-time charts.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- An Arkiv Network wallet with some ETH Mendoza testnet tokens
- Private key for your wallet

## Setup Instructions

### 1. Install Dependencies

From the `tutorial-source-code/fullstack-tutorial` directory:

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `tutorial-source-code/fullstack-tutorial` directory:

```bash
touch .env
```

Add your private key to the `.env` file:

```env
PRIVATE_KEY=your_private_key_here
```

**⚠️ Warning:** Never commit your `.env` file to version control. Make sure it's in your `.gitignore`.

### 3. Configure Frontend

Edit `frontend/script.js` and replace the placeholder address:

```javascript
// Replace this line with your actual wallet address:
const USER_ADDRESS = '0xYourAddressHere';

```

## Running the Application

### Start the Backend

The backend fetches cryptocurrency data from CoinGecko API and stores it on the Arkiv Network every 60 seconds.

From the `tutorial-source-code/fullstack-tutorial` directory:

```bash
node backend/index.js
```

You should see output like:
```
Backend service connected as: 0x1234567890123456789012345678901234567890
--- Starting new update cycle ---
Successfully fetched data from CoinGecko.
Created entity for bitcoin. Key: entity_key_here
Created entity for ethereum. Key: entity_key_here
Edit `frontend/script.js` and replace the placeholder address:

```javascript
// Replace this line with your actual wallet ad
Created entity for golem. Key: entity_key_here
```

### Start the Frontend

The frontend is a static web application that can be served using any HTTP server.

#### Option 1: Using Node.js (npx)

From the `tutorial-source-code/fullstack-tutorial/frontend` directory:

```bash
npx serve
```

### Access the Application

Open your web browser and navigate to:
```
http://localhost:8000
```

You should see the Arkiv Real-Time Crypto Dashboard with charts displaying Bitcoin, Ethereum, and Golem price data.
## How It Works

1. **Backend Process:**
   - Fetches current cryptocurrency prices from CoinGecko API
   - Creates entities on the Arkiv Network with price, market cap, and 24h change data
   - Runs continuously, updating data every 60 seconds
   - Each entity expires after 3 hours

2. **Frontend Application:**
   - Queries the Arkiv Network for cryptocurrency data
   - Displays real-time price information in cards
   - Shows historical price trends in interactive charts
   - Updates automatically every 30 seconds

## Troubleshooting

### Backend Issues

- **"PRIVATE_KEY is not set"**: Make sure your `.env` file exists and contains a valid private key
- **Network errors**: Check your internet connection and ensure you have sufficient test tokens
- **API rate limits**: CoinGecko API has rate limits; the 60-second interval should be sufficient for normal usage

### Frontend Issues

- **"Please set your USER_ADDRESS"**: Update the `USER_ADDRESS` variable in `script.js`
- **No data displayed**: Ensure the backend is running and has successfully uploaded data
- **CORS errors**: Make sure you're serving the frontend through an HTTP server, not opening the HTML file directly

### General Issues

- **No charts appearing**: Wait a few minutes for the backend to collect initial data
- **Outdated data**: Entities expire after 3 hours; restart the backend if data seems stale

## Development Tips

- Monitor the browser console for error messages
- Check the backend logs for successful data uploads
- The frontend updates every 30 seconds automatically
- Data on Arkiv expires after 3 hours, so the backend needs to run continuously

## Next Steps

- Experiment with different update intervals
- Add more cryptocurrencies to track
- Implement additional chart types
- Add real-time notifications for price changes
- Deploy to a cloud service for 24/7 operation

## Learn More

For detailed explanations and step-by-step instructions, refer to the full tutorial documentation in the `/src/content/docs/fullstack-tutorial/` directory.
## How It Works

1. **Backend Process:**
   - Fetches current cryptocurrency prices from CoinGecko API
   - Creates entities on the Arkiv Network with price, market cap, and 24h change data
   - Runs continuously, updating data every 60 seconds
   - Each entity expires after 3 hours

2. **Frontend Application:**
   - Queries the Arkiv Network for cryptocurrency data
   - Displays real-time price information in cards
   - Shows historical price trends in interactive charts
   - Updates automatically every 30 seconds

## Troubleshooting

### Backend Issues

- **"PRIVATE_KEY is not set"**: Make sure your `.env` file exists and contains a valid private key
- **Network errors**: Check your internet connection and ensure you have sufficient test tokens
- **API rate limits**: CoinGecko API has rate limits; the 60-second interval should be sufficient for normal usage

### Frontend Issues

- **"Please set your USER_ADDRESS"**: Update the `USER_ADDRESS` variable in `script.js`
- **No data displayed**: Ensure the backend is running and has successfully uploaded data
- **CORS errors**: Make sure you're serving the frontend through an HTTP server, not opening the HTML file directly

### General Issues

- **No charts appearing**: Wait a few minutes for the backend to collect initial data
- **Outdated data**: Entities expire after 3 hours; restart the backend if data seems stale

## Development Tips

- Monitor the browser console for error messages
- Check the backend logs for successful data uploads
- The frontend updates every 30 seconds automatically
- Data on Arkiv expires after 3 hours, so the backend needs to run continuously

## Next Steps

- Experiment with different update intervals
- Add more cryptocurrencies to track
- Implement additional chart types
- Add real-time notifications for price changes
- Deploy to a cloud service for 24/7 operation
