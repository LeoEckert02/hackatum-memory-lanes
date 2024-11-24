import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useDrawer } from './DrawerContext';
import PocketBase from 'pocketbase';

const url = 'https://memory-lanes.pockethost.io/';
const client = new PocketBase(url);

const center = {
  lat: 48.137221,
  lng: 11.575497,
};

function Map({ setSelectedLocation }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_API_KEY_HERE',
  });

  const [map, setMap] = React.useState(null);
  const [locations, setLocations] = React.useState([]);
  const [isDataLoaded, setIsDataLoaded] = React.useState(false);

  const { openDrawer } = useDrawer();

  const handleMarkerClick = (location) => {
    setSelectedLocation(location); // Pass data to parent state
    openDrawer(); // Open the drawer
  };

  const fetchData = async () => {
    try {
      const records = await client.collection('pin_data').getFullList({
        sort: '-created',
      });

      const fetchedLocations = records.map((record) => ({
        id: record.id,
        lat: record.lat,
        lng: record.long,
        firstname: record.firstname || 'Untitled Location',
        description: record.description || 'No description available.',
        landmark: record.landmark || 'No landmark available.',
        dob: record.dob || 'No date of birth available.',
      }));

      setLocations(fetchedLocations);
      setIsDataLoaded(true);
      console.log('Fetched locations:', fetchedLocations);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const onLoad = React.useCallback(
    async function callback(map) {
      const bounds = new window.google.maps.LatLngBounds();
      setMap(map);

      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary('marker');

      // Retrieve visited IDs from localStorage
      const visited = JSON.parse(localStorage.getItem('visited')) || [];

      locations.forEach((location) => {
        // Determine pin color based on whether location.id is in the visited list
        const isVisited = visited.includes(location.id);
        const pinColor = isVisited ? '#9c9c9c' : ''; // Green for visited, Yellow otherwise
        const pinBorderColor = isVisited ? '#454545' : '';

        const pinBackground = new PinElement({
          background: pinColor,
          borderColor: pinBorderColor,
          glyphColor: pinBorderColor,
        });

        const marker = new AdvancedMarkerElement({
          map,
          position: { lat: location.lat, lng: location.lng },
          title: location.firstname,
          gmpClickable: true,
          content: pinBackground.element,
        });

        marker.addListener('click', ({ domEvent, latLng }) => {
          console.log('Marker clicked:', location);
          handleMarkerClick(location);
        });

        bounds.extend(new window.google.maps.LatLng(location.lat, location.lng));
      });

      if (locations.length > 0) {
        map.fitBounds(bounds);
      }
    },
    [locations]
  );


  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);


  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    mapId: "DEMO_MAP_ID", // Map ID is required for advanced markers.
  };

  if (!isDataLoaded) {
    return <div className="w-screen h-screen flex justify-center items-center">Loading...</div>;
  }

  return isLoaded && isDataLoaded ? (
    <div className="w-full h-full fixed top-0 left-0 z-0">
      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
        
      />
    </div>
  ) : (
    <></>
  );
}

export default React.memo(Map);
