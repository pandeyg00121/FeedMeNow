function calculateDistance(userCoords, restaurantCoords) {
    const earthRadiusKm = 6371; // Radius of the Earth in kilometers
    const dLat = degreesToRadians(restaurantCoords.lat - userCoords.lat);
    const dLon = degreesToRadians(restaurantCoords.lng - userCoords.lng);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(degreesToRadians(userCoords.lat)) * Math.cos(degreesToRadians(restaurantCoords.lat)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c; // Distance in kilometers
    return distance;
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}