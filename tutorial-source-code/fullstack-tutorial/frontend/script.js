// TODO: Replace with your wallet address from the backend
const USER_ADDRESS = '0xYourAddressHere';

if (!USER_ADDRESS || USER_ADDRESS === '0xYourAddressHere') {
  alert('Please set your USER_ADDRESS in script.js to your wallet address!');
  throw new Error('USER_ADDRESS not configured');
}

// Import Arkiv SDK for blockchain data access
import { createPublicClient, http } from 'https://esm.sh/@arkiv-network/sdk@0.4.2?target=es2022&bundle-deps';
import { eq } from 'https://esm.sh/@arkiv-network/sdk@0.4.2/query?target=es2022&bundle-deps';
import { mendoza } from 'https://esm.sh/@arkiv-network/sdk@0.4.2/chains?target=es2022&bundle-deps';

// Import chart management functions
import {
  initializeCharts,
  updateChart,
  updateMarketCapChart,
  updatePriceBoxes,
  getCharts
} from './charts.js';

// Public client can only read data, no private key needed
const client = createPublicClient({
  chain: mendoza,
  transport: http(),
});

console.log('Arkiv client initialized for address:', USER_ADDRESS);

// Fetch token data from Arkiv blockchain
async function fetchTokenDataFromArkiv(tokenId) {
  const query = client.buildQuery();
  const result = await query
      .where(eq('token', tokenId))
      .ownedBy(USER_ADDRESS)
      .withPayload(true)
      .fetch();

  return result.entities
      .map(e => ({...e.toJson(), entityKey: e.key}))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Main update function to refresh all UI elements
async function updateUI() {
  try {
      // Fetch data for all three cryptocurrencies
      const [btcData, ethData, glmData] = await Promise.all([
          fetchTokenDataFromArkiv('bitcoin'),
          fetchTokenDataFromArkiv('ethereum'),
          fetchTokenDataFromArkiv('golem')
      ]);

      // Update UI if we have any data
      if (btcData.length > 0 || ethData.length > 0 || glmData.length > 0) {
          updatePriceBoxes(btcData, ethData, glmData);
          updateMarketCapChart(btcData, ethData, glmData);

          // Get chart instances and update price history charts
          const { btcPriceChart, ethPriceChart, glmPriceChart } = getCharts();
          if (btcData.length > 0) updateChart(btcPriceChart, btcData, 'price');
          if (ethData.length > 0) updateChart(ethPriceChart, ethData, 'price');
          if (glmData.length > 0) updateChart(glmPriceChart, glmData, 'price');

          console.log('UI updated successfully');
      }
  } catch (error) {
      console.error('Error updating UI:', error);
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  initializeCharts();
  updateUI();
  setInterval(updateUI, 15000); // Refresh every 15 seconds
});