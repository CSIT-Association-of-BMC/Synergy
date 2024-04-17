const tableBody = document.getElementById('t-body');

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const apiUrl = "http://localhost:3000/aqi/nearbyaqi";
  
        const data = {
          longitude: localStorage.getItem('Longitude'),
          latitude: localStorage.getItem('Latitude'),
        };

        console.log(data);
  
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        };
  
            const response = await fetch(apiUrl, options);
            if (!response.ok) {
                alert("Something went wrong");
                return
              }

        const aqiInfo = await response.json();

        for (let i = 0; i < aqiInfo.aqiData.length; i++) {
            tableBody.innerHTML += `<tr>
            <td>${aqiInfo.aqiData[i].location}</td>
            <td>${aqiInfo.aqiData[i].aqi}</td>
        </tr>`
        }
        return
    } catch (error) {
        console.error('Error:', error.message);
    }
})
