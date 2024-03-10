function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 20,
    });
  
    // Add click event listener to map
    google.maps.event.addListener(map, 'click', function(event) {
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();
      alert("Latitude: " + latitude + " Longitude: " + longitude);
    });
}
const defaultLocation = { lat: 25.49353648364225, lng: 81.8622475862503 };
// Latitude: 25.493532852063257 Longitude: 81.86225026845932