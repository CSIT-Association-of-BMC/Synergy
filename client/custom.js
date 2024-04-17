document.addEventListener('DOMContentLoaded', function() {
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
    var sampleData = [15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245];
  
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
  