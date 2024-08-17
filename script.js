let map, marker;
const ipGeoApiKey = import.meta.env.VITE_IPGEOLOCATION_API_KEY; 
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 
let trackedUserIP = ''; //  set by user via input

// map by google map api ( intialise map ) -------------------------------------------------
window.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), { //consturctor call 
        center: { lat: 0, lng: 0 },//initially
        zoom: 2,
    });
   marker = new google.maps.Marker({
        
        map: map,
        position: { lat: 0, lng: 0 }, // Initial position
        title: 'Tracked Location',
    });
}
// fetch location by IP add ...API IPgeolocation---------------------------
window.fetchLocation = function() {

    fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${ipGeoApiKey}&ip=${trackedUserIP}`)
        .then(response => response.json())
        .then(data => {
            if (data.latitude && data.longitude) {
                const pos = {
                    lat: parseFloat(data.latitude),
                    lng: parseFloat(data.longitude),
                };

                marker.setPosition(pos); // Update marker position
                map.setCenter(pos);// view 
                updateLocationDetails(data);
                clearError(); // Clear error if location data is valid
            } else {
                displayError('Location data is missing...Try entering a valid IP address');
            }
        })
        .catch(error => console.error('Error fetching location:', error))
}
// Function to display error message
function displayError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}
// Function to clear the error message
function clearError() {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}
// set Location  Details--------------------------------------------------
window.updateLocationDetails = function(data) {
    document.getElementById('coordinates').textContent = `latitude: ${data.latitude},longitude: ${data.longitude}`;
    document.getElementById('city').textContent = data.city || 'N/A';
    document.getElementById('country').textContent = data.country_name || 'N/A';
}

// onclick --update IP button ------------------------------------------------------
window.updateIP = function() {
    const ipInput = document.getElementById('ipAddressInput').value;
    const blinkTextElements = document.getElementsByClassName('blink-text');

    if (ipInput) {
        trackedUserIP = ipInput;
        fetchLocation(); // Updates location immediately after IP is set

        // Hide the blinking message if IP is entered
        if (blinkTextElements.length > 0) {
                 blinkTextElements[0].style.display = 'none';
        }
    } else {
        // Show and update the blinking message if no IP address is entered
        if (blinkTextElements.length > 0) {
            blinkTextElements[0].style.display = 'block';
            blinkTextElements[0].textContent = 'Enter IP address here ⬆️ ';
        }
    }
}


// Load Google Maps script dynamically-----------------------------------------
const script = document.createElement('script');//script tag created
script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initMap&libraries=marker`;
script.async = true;
script.defer = true;

document.head.appendChild(script);
