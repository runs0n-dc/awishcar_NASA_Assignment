const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const submitBtn = document.getElementById('submitBtn');
const neoChartCanvas = document.getElementById('neoChart');
const statsContainer = document.getElementById('statsContainer');

let neoChart;

submitBtn.addEventListener('click', () => {
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (neoChart) {
    neoChart.destroy();
  }

  fetchData(startDate, endDate)
    .then(data => {
      const labels = Object.keys(data.neoCountByDate);
      const values = Object.values(data.neoCountByDate);

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

      
      statsContainer.innerHTML = `
        <ul class="list-group" >
          <li class="list-group-item"><strong>Fastest Asteroid:</strong> ${data.fastestAsteroid.name} (${data.fastestAsteroid.speed.toFixed(2)} km/h) on ${data.fastestAsteroid.date}</li>
          <li class="list-group-item"><strong>Closest Asteroid:</strong> ${data.closestAsteroid.name} (${data.closestAsteroid.distance.toFixed(2)} km) on ${data.closestAsteroid.date}</li>
          <li class="list-group-item"><strong>Average Size:</strong> ${data.averageSize.toFixed(2)} km</li>
        </ul>
      `;
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
  let fastestAsteroid = null;
  let closestAsteroid = null;
  let totalSize = 0;
  let totalAsteroids = 0;

  for (const date in data.near_earth_objects) {
    const asteroids = data.near_earth_objects[date];
    neoCountByDate[date] = asteroids.length;

    asteroids.forEach(asteroid => {
      const speed = parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour);
      const distance = parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers);
      const size = parseFloat(asteroid.estimated_diameter.kilometers.estimated_diameter_max);

      if (!fastestAsteroid || speed > fastestAsteroid.speed) {
        fastestAsteroid = {
          speed: speed,
          date: date,
          name: asteroid.name
        };
      }

      if (!closestAsteroid || distance < closestAsteroid.distance) {
        closestAsteroid = {
          distance: distance,
          date: date,
          name: asteroid.name
        };
      }

      totalSize += size;
      totalAsteroids++;
    });
  }

  const averageSize = totalSize / totalAsteroids;

  return {
    neoCountByDate: neoCountByDate,
    fastestAsteroid: fastestAsteroid,
    closestAsteroid: closestAsteroid,
    averageSize: averageSize
  };
}
