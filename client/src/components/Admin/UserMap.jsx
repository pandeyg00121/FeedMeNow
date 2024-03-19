import { useState, useEffect } from 'react';
import { Box, Grid, Heading } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import customIcon from '../../assets/location.jpg'; // Import your custom icon
import Sidebar from './Sidebar';


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
      setMapCenter([25.00,81.00]);
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
  // const { isLoading, isError, isSuccess, data, error } = useGetUserMapQuery('');
  // const [isMapLoaded, setIsMapLoaded] = useState(false);

  // console.log(isLoading, isError, isSuccess, data, error);
  const [users, setUsers] = useState([
    { name: 'Priyanshu', coordinates: [25.4358, 81.8463] },
    { name: 'Jatin', coordinates: [25.4486, 81.8337] },
    { name: 'Abhinav', coordinates: [25.45, 81.85] },
    { name: 'Pranay', coordinates: [25.4345, 81.8467] },
    { name: 'Manasvi', coordinates: [25.4475, 81.8551] },
    { name: 'Palash', coordinates: [25.4385, 81.8481] },
    { name: 'Harsh', coordinates: [25.4398, 81.8342] },
    { name: 'Arjav', coordinates: [25.4472, 81.8515] },
    { name: 'Ankush', coordinates: [25.4311, 81.8406] },
    { name: 'Ayush', coordinates: [25.4436, 81.8391] },
    { name: 'Deepanshu', coordinates: [25.4369, 81.8533] },
    { name: 'Neelansh', coordinates: [25.4514, 81.8445] },
    { name: 'Ashu', coordinates: [25.4478, 81.8376] },
    { name: 'Snehal', coordinates: [25.4323, 81.848] },
    { name: 'Kamal', coordinates: [25.4462, 81.8412] },
  ]);
  // useEffect(() => {
  //   if (isSuccess) {
  //     setIsMapLoaded(true);
  //   }
  // }, [isSuccess]);
  // useEffect(() => {
  //   if (!isLoading && data) {
  //     setUsers(data);
  //   }
  // }, [isLoading, data]);

  // useEffect(() => {
  //   console.log(users);
  // }, [users]);
  // // const [users] = useState([
  //   { id: 1, name: 'Delhi', location: [28.7041, 77.1025] },
  //   { id: 2, name: 'Mumbai', location: [19.076, 72.8777] },
  //   { id: 3, name: 'Kolkata', location: [22.5726, 88.3639] },
  //   { id: 4, name: 'Chennai', location: [13.0827, 80.2707] },
  //   { id: 5, name: 'Bangalore', location: [12.9716, 77.5946] },
  // ]);

  return <UserMap users={users} />;
};

export default Map;
