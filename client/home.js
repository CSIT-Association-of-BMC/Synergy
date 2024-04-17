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



