import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Calendar, Flame, Home, MapPin, Search, User } from 'lucide-react';
import React, { useRef, useState } from 'react';

// Map container styles
const containerStyle = {
  width: '100%',
  height: '100%'
};

// Custom map styles for dark mode - similar to the screenshot
const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#00b2ff" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

// Event interface
interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string; 
  coordinates: [number, number];
  imageUrl: string;
  featured?: boolean;
}

// Sample event data
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Concert at Catherine Hall',
    date: 'Aug 21, 2025',
    time: '8:00 PM',
    location: 'Catherine Hall Stadium, St. James',
    coordinates: [18.503, -77.913],
    imageUrl: '/event1.jpg',
    featured: true
  },
  {
    id: '2',
    title: 'Beach Party',
    date: 'Aug 25, 2025',
    time: '3:00 PM',
    location: 'Doctors Cave Beach',
    coordinates: [18.490, -77.927],
    imageUrl: '/event2.jpg'
  },
  {
    id: '3',
    title: 'Food Festival',
    date: 'Aug 27, 2025',
    time: '12:00 PM',
    location: 'Montego Bay Cultural Centre',
    coordinates: [18.472, -77.920],
    imageUrl: '/event3.jpg'
  },
  {
    id: '4',
    title: 'Art Exhibition',
    date: 'Sep 3, 2025',
    time: '10:00 AM',
    location: 'Montego Bay Convention Centre',
    coordinates: [18.533, -77.860],
    imageUrl: '/event4.jpg'
  },
  {
    id: '5',
    title: 'Wine Tasting',
    date: 'Sep 10, 2025',
    time: '6:00 PM',
    location: 'Roundhill Resort',
    coordinates: [18.447, -77.943],
    imageUrl: '/event5.jpg'
  }
];

// Search component
function SearchControl({ map }: { map: google.maps.Map | null }) {
  const [searchText, setSearchText] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would make an API call to a geocoding service
    // For now, we'll just center the map on Montego Bay
    if (map) {
      map.setCenter({ lat: 18.4762, lng: -77.8939 });
      map.setZoom(13);
    }
  };
  
  return (
    <div className="absolute top-4 right-4 z-40">
      <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full shadow-md">
        <input
          type="text"
          placeholder="Search places..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="px-4 py-2 rounded-l-full outline-none w-64"
        />
        <button type="submit" className="p-2 bg-white rounded-r-full">
          <Search size={24} className="text-gray-600" />
        </button>
      </form>
    </div>
  );
}

// Event card component 
function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-black bg-opacity-80 text-white rounded-lg overflow-hidden shadow-lg">
      <div className="relative h-32">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          {/* Event image with overlay */}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center mb-2">
          <Calendar size={16} className="mr-2" />
          <span className="text-sm">{event.date} at {event.time}</span>
        </div>
        <div className="flex items-center">
          <MapPin size={16} className="mr-2" />
          <span className="text-sm truncate">{event.location}</span>
        </div>
      </div>
    </div>
  );
}

// Main Map component
const Map: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "", // You need to set this in your .env file
  });

  const handleMarkerClick = (event: Event) => {
    setSelectedEvent(event);
    if (mapInstance) {
      mapInstance.setCenter({ lat: event.coordinates[0], lng: event.coordinates[1] });
      mapInstance.setZoom(15);
    }
  };

  const onMapLoad = (map: google.maps.Map) => {
    setMapInstance(map);
    map.setOptions({
      styles: darkMapStyles,
      disableDefaultUI: true,
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
    });
  };

  return (
    <div className="h-screen w-full relative">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: 18.4762, lng: -77.8939 }} // Montego Bay coordinates
          zoom={13}
          onLoad={onMapLoad}
          options={{
            styles: darkMapStyles,
            disableDefaultUI: true,
          }}
        >
          <SearchControl map={mapInstance} />

          {/* Event Markers */}
          {sampleEvents.map(event => (
            <Marker 
              key={event.id} 
              position={{ lat: event.coordinates[0], lng: event.coordinates[1] }}
              icon={{
                url: '/orange-marker.png', // You'll need to add this to your public folder
                scaledSize: new google.maps.Size(event.featured ? 35 : 25, event.featured ? 35 : 25),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(event.featured ? 17 : 12, event.featured ? 35 : 25),
              }}
              onClick={() => handleMarkerClick(event)}
            >
              {selectedEvent?.id === event.id && (
                <InfoWindow
                  position={{ lat: event.coordinates[0], lng: event.coordinates[1] }}
                  onCloseClick={() => setSelectedEvent(null)}
                >
                  <div>
                    <EventCard event={event} />
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gray-900">
          <p className="text-white">Loading map...</p>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-black text-white flex justify-around items-center py-3">
        <button className="flex flex-col items-center">
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center">
          <Flame size={24} />
          <span className="text-xs mt-1">Trending</span>
        </button>
        <button className="flex flex-col items-center">
          <MapPin size={24} className="text-white" />
          <span className="text-xs mt-1">Map</span>
        </button>
        <button className="flex flex-col items-center">
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>

      {/* Selected Event Modal (if needed) */}
      {selectedEvent && (
        <div className="absolute bottom-16 left-4 right-4 bg-black bg-opacity-90 text-white rounded-lg p-4 shadow-lg z-50">
          <div className="flex">
            <div className="w-1/3">
              <img 
                src={selectedEvent.imageUrl}
                alt={selectedEvent.title}
                className="w-full h-24 object-cover rounded-lg"
              />
            </div>
            <div className="w-2/3 pl-4">
              <h3 className="font-bold">{selectedEvent.title}</h3>
              <div className="flex items-center mt-2">
                <Calendar size={16} className="mr-2" />
                <span className="text-sm">{selectedEvent.date} at {selectedEvent.time}</span>
              </div>
              <div className="flex items-center mt-1">
                <MapPin size={16} className="mr-2" />
                <span className="text-sm">{selectedEvent.location}</span>
              </div>
            </div>
          </div>
          <button 
            className="absolute top-2 right-2 text-white"
            onClick={() => setSelectedEvent(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default Map;