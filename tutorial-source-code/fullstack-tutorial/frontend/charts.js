// Import Chart.js and plugins from CDN
import {Chart, registerables} from 'https://cdn.jsdelivr.net/npm/chart.js@4/+esm';

// Chart instances
let marketCapChart, btcPriceChart, ethPriceChart, glmPriceChart;

// Helper function to format market cap values
function formatMarketCap(value) {
  if (value >= 1e12) return '$' + (value / 1e12).toFixed(1) + 'T';
  if (value >= 1e9) return '$' + (value / 1e9).toFixed(1) + 'B';
  if (value >= 1e6) return '$' + (value / 1e6).toFixed(0) + 'M';
  return '$' + value.toLocaleString();
}

// Plugin to draw labels above bars (only for bar charts)
const afterDatasetsDraw = {
  id: 'afterDatasetsDraw',
  afterDatasetsDraw(chart) {
      // Only apply to bar charts
      if (chart.config.type !== 'bar') {
          return;
      }

      const { ctx, chartArea: { top }, scales: { x, y } } = chart;

      chart.data.datasets.forEach((dataset, datasetIndex) => {
          const meta = chart.getDatasetMeta(datasetIndex);

          meta.data.forEach((bar, index) => {
              const value = dataset.data[index];
              const text = formatMarketCap(value);

              ctx.save();
              ctx.font = 'bold 12px sans-serif';
              ctx.fillStyle = '#1f2937';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';

              // Draw text above the bar
              ctx.fillText(text, bar.x, bar.y - 5);
              ctx.restore();
          });
      });
  }
};

// Initialize all chart instances
export function initializeCharts() {
  Chart.register(...registerables);
  Chart.register(afterDatasetsDraw);

// Configuration for line charts (price history)
const lineChartConfig = (label, color) => ({
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label,
            data: [],
            borderColor: color,
            backgroundColor: color + '20',
            tension: 0.4,
            fill: true,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            y: { beginAtZero: false }
        }
    }
});

// Market cap bar chart showing latest values for each token
marketCapChart = new Chart(
    document.getElementById('marketCapChart'),
    {
        type: 'bar',
        data: {
            labels: ['Bitcoin', 'Ethereum', 'Golem'],
            datasets: [{
                label: 'Market Cap (USD)',
                data: [0, 0, 0],
                backgroundColor: ['#f59e0b', '#8b5cf6', '#10b981'],
                borderColor: ['#d97706', '#7c3aed', '#059669'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            layout: {
                padding: {
                    top: 30,
                    bottom: 10,
                    left: 10,
                    right: 10
                }
            },
            scales: {
                y: {
                    type: 'logarithmic',
                    beginAtZero: false,
                    min: 1e6,
                    ticks: {
                        callback: function(value) {
                            if (value >= 1e12) return '$' + (value / 1e12).toFixed(1) + 'T';
                            if (value >= 1e9) return '$' + (value / 1e9).toFixed(1) + 'B';
                            if (value >= 1e6) return '$' + (value / 1e6).toFixed(0) + 'M';
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    }
);

// Initialize price history line charts
btcPriceChart = new Chart(
    document.getElementById('btcPriceChart'),
    lineChartConfig('Bitcoin Price (USD)', '#f59e0b')
);
ethPriceChart = new Chart(
    document.getElementById('ethPriceChart'),
    lineChartConfig('Ethereum Price (USD)', '#8b5cf6')
);
glmPriceChart = new Chart(
    document.getElementById('glmPriceChart'),
    lineChartConfig('Golem Price (USD)', '#10b981')
);
}

// Update a line chart with new data
export function updateChart(chart, data, priceKey) {
const labels = data.map(d => {
    const date = new Date(d.timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}).reverse();
const prices = data.map(d => d[priceKey]).reverse();

chart.data.labels = labels;
chart.data.datasets[0].data = prices;
chart.update();
}

// Update market cap bar chart with latest values
export function updateMarketCapChart(btcData, ethData, glmData) {
const latestValues = [
    btcData.length > 0 ? btcData[0].marketCap : 0,
    ethData.length > 0 ? ethData[0].marketCap : 0,
    glmData.length > 0 ? glmData[0].marketCap : 0
];

marketCapChart.data.datasets[0].data = latestValues;
marketCapChart.update();
}

// Render price boxes with current prices and 24h changes
export function updatePriceBoxes(btcData, ethData, glmData) {
  const container = document.getElementById('price-container');
  container.innerHTML = '';

  const tokens = [
      { name: 'Bitcoin', data: btcData, symbol: 'BTC' },
      { name: 'Ethereum', data: ethData, symbol: 'ETH' },
      { name: 'Golem', data: glmData, symbol: 'GLM' }
  ];

  tokens.forEach(token => {
      if (token.data.length === 0) return;

      const latest = token.data[0];
      const priceChange = latest.change24h || 0;
      const changeClass = priceChange >= 0 ? 'positive' : 'negative';
      const changeSign = priceChange >= 0 ? '+' : '';
      const explorerUrl = `https://explorer.kaolin.hoodi.arkiv.network/entity/${latest.entityKey}?tab=data`;

      const box = document.createElement('div');
      box.className = 'price-box';
      box.innerHTML = `
          <div class="token-name">${token.name} (${token.symbol})</div>
          <div class="current-price">$${latest.price.toLocaleString()}</div>
          <div class="price-change ${changeClass}">
              ${changeSign}${priceChange.toFixed(2)}% (24h)
          </div>
          <a href="${explorerUrl}" target="_blank" class="explorer-link">View on Arkiv Explorer →</a>
      `;
      container.appendChild(box);
  });
}

// Export chart instances for direct access if needed
export function getCharts() {
return { marketCapChart, btcPriceChart, ethPriceChart, glmPriceChart };
}