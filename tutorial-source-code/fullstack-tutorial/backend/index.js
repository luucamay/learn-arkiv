import { createWalletClient, http } from '@arkiv-network/sdk';
import { kaolin } from '@arkiv-network/sdk/chains';
import { privateKeyToAccount } from '@arkiv-network/sdk/accounts';
import { ExpirationTime, jsonToPayload } from '@arkiv-network/sdk/utils';
import axios from 'axios';

// Load the private key from the environment file.
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error("PRIVATE_KEY is not set in the .env file.");
}

// Create an account object from the private key.
const account = privateKeyToAccount(privateKey);

// Create a wallet client to interact with Arkiv.
const client = createWalletClient({
  chain: kaolin, // We are using the Kaolin testnet.
  transport: http(),
  account: account,
});

console.log(`Backend service connected as: ${client.account.address}`);

// Construct the CoinGecko API URL
const params = new URLSearchParams({
  vs_currency: 'usd',
  ids: 'bitcoin,ethereum,golem',
  sparkline: 'false'
});
const COINGECKO_URL = `https://api.coingecko.com/api/v3/coins/markets?${params}`;

async function fetchCryptoData() {
  try {
      const response = await axios.get(COINGECKO_URL);
      console.log('Successfully fetched data from CoinGecko.');
      return response.data;
  } catch (error) {
      console.error('Error fetching data from CoinGecko:', error.message);
      return []; // Return an empty array on failure.
  }
}

async function uploadDataToArkiv(cryptoData) {
  if (cryptoData.length === 0) {
      console.log("No crypto data to upload.");
      return;
  }

  try {
      // Create payload objects for all tokens
      const createPayloads = cryptoData.map(tokenData => {
          const {
              id,
              current_price,
              market_cap,
              price_change_percentage_24h
          } = tokenData;
          return {
              payload: jsonToPayload({
                  price: current_price,
                  marketCap: market_cap,
                  change24h: price_change_percentage_24h,
                  timestamp: Date.now(),
              }),
              contentType: 'application/json',
              attributes: [
                  { key: 'token', value: id }, // 'bitcoin', 'ethereum', or 'golem'
              ],
              expiresIn: ExpirationTime.fromHours(3), // Data expires after 3 hours.
          };
      });

      const result = await client.mutateEntities({
          creates: createPayloads
      });

      // Log success for each created entity
      result.createdEntities.forEach((entityKey, index) => {
          const tokenId = cryptoData[index].id;
          console.log(`Created entity for ${tokenId}. Key: ${entityKey}`);
      });

  } catch (error) {
      console.error('Failed to create entities:', error.message);
  }
}

async function runUpdateCycle() {
  console.log("\n--- Starting new update cycle ---");
  const cryptoData = await fetchCryptoData();

  if (cryptoData.length > 0) {
      // Upload all tokens in a single mutateEntities call
      await uploadDataToArkiv(cryptoData);
  }
}

// Run the cycle on start, and then every 60 seconds.
runUpdateCycle();
setInterval(runUpdateCycle, 60000); // 60000 ms = 60 seconds