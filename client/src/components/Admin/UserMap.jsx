import { useState, useEffect } from 'react';
import { Box, Grid, Heading } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import customIcon from '../../assets/location.jpg'; // Import your custom icon
import Sidebar from './Sidebar';
import { useGetUserMapQuery } from '../../redux/api';

// Fix for Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;

// Create custom marker icon
const locationMarkerIcon = L.icon({
  iconUrl: customIcon, // Path to your custom icon
  iconSize: [32, 32], // Set the size of the icon
  iconAnchor: [16, 32], // Set the anchor point of the icon
});

const UserMap = ({ users, isMapLoaded }) => {
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default center of India
  const [mapZoom] = useState(5); // Initial zoom level of the map

  useEffect(() => {
    if (users.length > 0) {
      // Calculate the average latitude and longitude
      const avgLatitude =
        users.reduce((total, user) => total + user.coordinates[0], 0) /
        users.length;
      const avgLongitude =
        users.reduce((total, user) => total + user.coordinates[1], 0) /
        users.length;
      setMapCenter([avgLatitude, avgLongitude]);
    }
  }, [users]);

  return (
    <Grid templateColumns="1fr auto" gap="4" height="100vh">
      <Box>
        <Heading as="h1" textAlign="center" mt={10} mb="10" fontSize="2xl">
          User Map
        </Heading>
        <Box width="100%" height="600px" margin="auto">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {users.map(user => (
              <Marker
                key={user.id}
                position={user.coordinates}
                icon={locationMarkerIcon}
              >
                <Popup>{user.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>
      </Box>
      <Sidebar />
    </Grid>
  );
};

const Map = () => {
  const { isLoading, isError, isSuccess, data, error } = useGetUserMapQuery('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  console.log(isLoading, isError, isSuccess, data, error);
  const [users, setUsers] = useState([
    { name: 'Delhi', coordinates: [28.7041, 77.1025] },
    { name: 'Mumbai', coordinates: [19.076, 72.8777] },
    { name: 'Kolkata', coordinates: [22.5726, 88.3639] },
    { name: 'Chennai', coordinates: [13.0827, 80.2707] },
    { name: 'Bangalore', coordinates: [12.9716, 77.5946] },
  ]);
  useEffect(() => {
    if (isSuccess) {
      setIsMapLoaded(true);
    }
  }, [isSuccess]);
  useEffect(() => {
    if (!isLoading && data) {
      setUsers(data);
    }
  }, [isLoading, data]);

  useEffect(() => {
    console.log(users);
  }, [users]);

  return <UserMap users={users} />;
};

export default Map;
