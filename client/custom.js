var sampleData = [];

document.addEventListener('DOMContentLoaded', async function() {

  let latitude;
  let longitude;
  try {
    // Once position is obtained, extract latitude and longitude
     latitude = localStorage.getItem('Latitude');
     longitude = localStorage.getItem('Longitude');

    // Now you can use latitude and longitude for further processing
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);
    
    // Call a function or perform any action that requires latitude and longitude
    // Example: fetchAQIData(latitude, longitude);
} catch (error) {
    console.error('Error obtaining position:', error);
    return
}

  try {
      const apiUrl = "http://localhost:3000/aqi/getHistory";

      const data = {
        longitude: longitude,
        latitude: latitude,
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };


      if(latitude && longitude) {
          const response = await fetch(apiUrl, options);
          if (!response.ok) {
              alert("Something went wrong");
              return
            }
      
            const responseData = await response.json();
            console.log(responseData);

            for (let i=0; i < responseData.data.hoursInfo.length; i++) {
              console.log(responseData.data.hoursInfo[i].indexes[0].aqi);
              sampleData.push(responseData.data.hoursInfo[i].indexes[0].aqi)
            }
      }
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        return
      }

    
  var options = {
      series: [{
        name: 'AQI',
        data: [] // Data for 24 hours will be updated dynamically
      }],
      chart: {
        type: 'bar',
        background: 'transparent',
        height: 600,
        toolbar: {
          show: false,
        },
      },
      colors: ['#287E74'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '60%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        opacity: 1,
      },
      grid: {
        borderColor: '#55596e',
        yaxis: {
          lines: {
            show: true,
          },
        },
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
      legend: {
        show: false,
      },
      stroke: {
        colors: ['transparent'],
        show: true,
        width: 2,
      },
      tooltip: {
        shared: true,
        intersect: false,
        theme: 'dark',
      },
      xaxis: {
        categories: [], // Labels for 24 hours will be updated dynamically
        title: {
          text: 'Hour of the Day',
          style: {
            color: '#287E74',
            fontSize: '16px',
          },
        },
        axisBorder: {
          show: true,
          color: '#55596e',
        },
        axisTicks: {
          show: true,
          color: '#55596e',
        },
        labels: {
          style: {
            colors: '#000',
          },
        },
      },
      yaxis: {
        title: {
          text: 'AQI',
          style: {
            color: '#287E74',
            fontSize: '16px',
          },
        },
        axisBorder: {
          color: '#287E74',
          show: true,
        },
        axisTicks: {
          color: '#55596e',
          show: true,
        },
        type:'numeric',
        stepSize: 50,
        floating: false,
        min: 0,
        max: 500,
        decimalsInFloat: 0,
        tickPlacement: 'between',
        labels: {
          formatter: function (value) {
            return value.toFixed();
          },
          style: {
            colors: '#000',
          },
        },
      },
    };
  
    var chart = new ApexCharts(document.querySelector('#aqi-chart'), options);
    chart.render();
  
    // Sample data (replace with actual AQI data)
  
    var labels = Array.from({ length: 24 }, (_, i) => {
      if (i === 0) return '12am';
      if (i < 12) return i + 'am';
      if (i === 12) return '12pm';
      return (i - 12) + 'pm';
    });
    
    updateChart(sampleData, labels); // Initial rendering with sample data (to be replaced)
  
    // Function to update the chart with new data
    function updateChart(data, labels) {
      chart.updateSeries([{ data }]);
      chart.updateOptions({ xaxis: { categories: labels } });
    }
  });
  