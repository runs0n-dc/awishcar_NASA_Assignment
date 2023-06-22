
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const submitBtn = document.getElementById('submitBtn');
const neoChartCanvas = document.getElementById('neoChart');

let neoChart; 

submitBtn.addEventListener('click', () => {
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (neoChart) {
    neoChart.destroy(); 
  }

  fetchData(startDate, endDate)
    .then(data => {
      const labels = Object.keys(data);
      const values = Object.values(data);

      neoChart = new Chart(neoChartCanvas, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Asteroids Passing Near Earth',
            data: values,
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              precision: 0
            }
          }
        }
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
});
async function fetchData(startDate, endDate) {
  
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=YcFTUGdkOAF0jv0CSsAgEWbr2G4mpPNs9AKL5hzX`;

  const response = await fetch(url);
  const data = await response.json();

  const neoCountByDate = {};

  for (const date in data.near_earth_objects) {
    neoCountByDate[date] = data.near_earth_objects[date].length;
  }

  return neoCountByDate;
}
