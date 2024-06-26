
const bellIcon = document.getElementById('bell-icon');
const notificationDropdown = document.getElementById('notification-dropdown');
const signinModal = document.getElementById('signin-modal');
const signinBtn = document.getElementById('signin-btn');
const closeBtn = document.querySelector('.close');
const username = document.getElementById('username');
const displayLocation = document.getElementsByClassName("real-time-location")[0];
const aqi = document.getElementsByClassName("aqi-number")[0];
const aqi_category = document.getElementsByClassName("aqi-category")[0];
const searchIcon = document.getElementById('search-icon');
const general_health_recommendation = document.getElementById("general-content")
const elderly_health_recommendation = document.getElementById("elderly-content")
const pregnent_health_recommendation = document.getElementById("pregnant-content")
const respiratory_health_recommendation = document.getElementById("respiratory-content")

searchIcon.addEventListener('click', async function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    
    // Get the keyword from the search input
    const keyword = document.getElementById('search-input').value;

    try {
        // Make the fetch request to '/search' endpoint with the keyword as a query parameter
        const response = await fetch(`http://localhost:3000/aqi/search?keyword=${encodeURIComponent(keyword)}`);

        // Check if the response is successful
        if (response.ok) {
            // Parse the response JSON
            const resp = await response.json();
            console.log(`RESP IS: aqy `, resp.AQIInfo.user.username);
          let searchData = resp
            // Handle the search data here
            username.innerText = resp.AQIInfo.user.username;
            displayLocation.innerText = resp.AQIInfo.address;
            aqi.innerHTML = `<p> ${resp.AQIInfo.data.indexes[0].aqi} </p>`;
            aqi_category.innerText = resp.AQIInfo.data.indexes[0].category;
            return
        } else {
            // If response is not ok, log the error
            console.error('Search request failed:', response.status);
            return
        }
    } catch (error) {
        // Log any errors that occur during the fetch request
        console.error('Error occurred during search request:', error);
    }
});


async function handleSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    localStorage.setItem('Latitude',latitude)
    localStorage.setItem('Longitude',longitude)

    try {
        const apiUrl = "http://localhost:3000/aqi/getCurrentAQI";
  
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
              username.innerText = responseData.user.username;
              displayLocation.innerText = responseData.address;
              aqi.innerHTML = `<p> ${responseData.data.indexes[0].aqi} </p>`;
              aqi_category.innerText = responseData.data.indexes[0].category;
              general_health_recommendation.innerHTML = `<p> ${responseData.data.healthRecommendations.generalPopulation} </p>`     
              elderly_health_recommendation.innerHTML  = `<p> ${responseData.data.healthRecommendations.elderly} </p>`
              respiratory_health_recommendation.innerHTML = `<p> ${responseData.data.healthRecommendations.lungDiseasePopulation} </p>`
              pregnent_health_recommendation.innerHTML = `<p> ${responseData.data.healthRecommendations.pregnantWomen} </p>`

              return
        }
        alert("Failed to get current location");
        
        return
  
      } catch (error) {
          console.error("There was a problem with the fetch operation:", error);
        }
    
  

}

// Function to request location permission
function requestLocationPermission() {
    // Check if geolocation is supported by the browser
    if ("geolocation" in navigator) {
        // Request location permission
        navigator.geolocation.getCurrentPosition(
            // Success callback
            function(position) {
                handleSuccess(position);
            },
            // Error callback
            function(error) {
                console.error("Error getting location:", error);
                reject(error);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
        // Handle lack of geolocation support
    }
}

// Call the function to request location permission
requestLocationPermission();


bellIcon.addEventListener('click', function() {
    if (!isUserSignedIn()) {
        showSigninModal();
    } else {
        toggleNotificationDropdown();
    }
});

signinBtn.addEventListener('click', function() {
    window.location.href = 'index.html';
});

closeBtn.addEventListener('click', function() {
    hideSigninModal();
});

function toggleNotificationDropdown() {
    if (notificationDropdown.style.display === 'block') {
        notificationDropdown.style.display = 'none';
    } else {
        notificationDropdown.style.display = 'block';
    }
}

function isUserSignedIn() {
    return false; // For demonstration purposes, always return false
}

function showSigninModal() {
    signinModal.style.display = 'block';
}

function hideSigninModal() {
    signinModal.style.display = 'none';
}

document.addEventListener("DOMContentLoaded", function() {
    var categoryBoxes = document.querySelectorAll('.category-box');
    var preventionContents = document.querySelectorAll('.prevention-content');
    var closeicons = document.getElementsByClassName('closeicon');

    // Function to hide all prevention contents and show only the clicked one
    function showPreventionContent(index) {
        preventionContents.forEach(function(content) {
            content.style.display = 'none';
        });
        preventionContents[index].style.display = 'block';

        // Show the close icon for the current content
        closeicons[index].style.display = 'block';
    }

    categoryBoxes.forEach(function(box, index) {
        box.addEventListener('click', function() {
            // Hide all category boxes
            categoryBoxes.forEach(function(categoryBox) {
                categoryBox.style.display = 'none';
            });

            // Show the corresponding content based on the index
            showPreventionContent(index);
        });
    });

    // Function to reset to initial state
    function resetState() {
        preventionContents.forEach(function(content) {
            content.style.display = 'none';
        });
        categoryBoxes.forEach(function(categoryBox) {
            categoryBox.style.display = 'block';
        });
        closeicons.forEach(function(closeicon) {
            closeicon.style.display = 'none';
        });
    }

    // Add event listener for each close icon
    for (var i = 0; i < closeicons.length; i++) {
        closeicons[i].addEventListener('click', function() {
            resetState();
        });
    }
});