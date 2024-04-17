const bellIcon = document.getElementById('bell-icon');
const notificationDropdown = document.getElementById('notification-dropdown');
const aqiNotificationToggle = document.getElementById('aqi-notification');
const dailyNotificationToggle = document.getElementById('daily-notification');
const notificationTimeInput = document.getElementById('notification-time');

bellIcon.addEventListener('click', toggleNotificationDropdown);

function toggleNotificationDropdown() {
    if (notificationDropdown.style.display === 'block') {
        notificationDropdown.style.display = 'none';
    } else {
        notificationDropdown.style.display = 'block';
    }
}

dailyNotificationToggle.addEventListener('change', function() {
    if (this.checked) {
        notificationTimeInput.disabled = false;
    } else {
        notificationTimeInput.disabled = true;
    }
});

const content = document.querySelector('.content');

function toggleNotificationDropdown() {
    if (notificationDropdown.style.display === 'block') {
        notificationDropdown.style.display = 'none';
        content.classList.remove('blur');
    } else {
        notificationDropdown.style.display = 'block';
        content.classList.add('blur');
    }
}

function handleSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
    // You can do further processing with latitude and longitude here
}

// Function to request location permission
function requestLocationPermission() {
    // Check if geolocation is supported by the browser
    if ("geolocation" in navigator) {
        // Request location permission
        navigator.geolocation.getCurrentPosition(
            // Success callback
            handleSuccess,
            // Error callback
            function(error) {
                console.error("Error getting location:", error);
                // Handle errors here
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
        // Handle lack of geolocation support
    }
}

// Call the function to request location permission
requestLocationPermission();


