import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const NIZHNY_NOVGOROD_BOUNDS = {
  minLat: 56.20,
  maxLat: 56.40,
  minLng: 43.90,
  maxLng: 44.10,
};


const generateRandomCoordinate = (): [number, number] => [
  Number(
    (Math.random() * (NIZHNY_NOVGOROD_BOUNDS.maxLat - NIZHNY_NOVGOROD_BOUNDS.minLat) + NIZHNY_NOVGOROD_BOUNDS.minLat
  ).toFixed(6)
  ),
  Number(
    (Math.random() * (NIZHNY_NOVGOROD_BOUNDS.maxLng - NIZHNY_NOVGOROD_BOUNDS.minLng) + NIZHNY_NOVGOROD_BOUNDS.minLng
  ).toFixed(6)
  ),
];

const MapComponent = () => {
  const [position1, setPosition1] = useState<[number, number]>(generateRandomCoordinate());
  const [position2, setPosition2] = useState<[number, number]>(generateRandomCoordinate());
  const [lineVisible, setLineVisible] = useState(false);
  const [error, setError] = useState('');

  const validateCoordinate = (value: string, type: 'lat' | 'lng'): boolean => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setError('Please enter a valid number');
      return false;
    }
    
    if (type === 'lat' && (num < NIZHNY_NOVGOROD_BOUNDS.minLat || num > NIZHNY_NOVGOROD_BOUNDS.maxLat)) {
      setError(`Latitude must be between ${NIZHNY_NOVGOROD_BOUNDS.minLat} and ${NIZHNY_NOVGOROD_BOUNDS.maxLat}`);
      return false;
    }
    
    if (type === 'lng' && (num < NIZHNY_NOVGOROD_BOUNDS.minLng || num > NIZHNY_NOVGOROD_BOUNDS.maxLng)) {
      setError(`Longitude must be between ${NIZHNY_NOVGOROD_BOUNDS.minLng} and ${NIZHNY_NOVGOROD_BOUNDS.maxLng}`);
      return false;
    }
    
    setError('');
    return true;
  };

  const handleCoordinateChange = (
    positionSetter: React.Dispatch<React.SetStateAction<[number, number]>>,
    index: number,
    value: string,
    type: 'lat' | 'lng'
  ) => {
    if (!validateCoordinate(value, type)) return;
    
    positionSetter(prev => {
      const newPos: [number, number] = [...prev];
      newPos[index] = parseFloat(value);
      return newPos;
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <h3>Point 1</h3>
          <label>
            Latitude:
            <input
              type="number"
              value={position1[0]}
              onChange={(e) => handleCoordinateChange(setPosition1, 0, e.target.value, 'lat')}
              step="0.000001"
              style={{ margin: '0 10px' }}
            />
          </label>
          <label>
            Longitude:
            <input
              type="number"
              value={position1[1]}
              onChange={(e) => handleCoordinateChange(setPosition1, 1, e.target.value, 'lng')}
              step="0.000001"
              style={{ margin: '0 10px' }}
            />
          </label>
          <button onClick={() => setPosition1(generateRandomCoordinate())}>
            Randomize
          </button>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <h3>Point 2</h3>
          <label>
            Latitude:
            <input
              type="number"
              value={position2[0]}
              onChange={(e) => handleCoordinateChange(setPosition2, 0, e.target.value, 'lat')}
              step="0.000001"
              style={{ margin: '0 10px' }}
            />
          </label>
          <label>
            Longitude:
            <input
              type="number"
              value={position2[1]}
              onChange={(e) => handleCoordinateChange(setPosition2, 1, e.target.value, 'lng')}
              step="0.000001"
              style={{ margin: '0 10px' }}
            />
          </label>
          <button onClick={() => setPosition2(generateRandomCoordinate())}>
            Randomize
          </button>
        </div>

        <button 
          onClick={() => setLineVisible(!lineVisible)}
          style={{ marginBottom: '10px' }}
        >
          {lineVisible ? 'Hide Line' : 'Show Line'}
        </button>

        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>

      <MapContainer
        center={position1}
        zoom={13}
        style={{ height: '500px', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position1}>
          <Popup>Point 1</Popup>
        </Marker>
        <Marker position={position2}>
          <Popup>Point 2</Popup>
        </Marker>
        {lineVisible && (
          <Polyline
            positions={[position1, position2]}
            color="blue"
            weight={3}
            opacity={0.7}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;