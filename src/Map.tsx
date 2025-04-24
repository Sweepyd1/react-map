import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import './MapComponent.css';

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
    <div className="map-container">
      <div className="control-panel">
        {}
        <div className="point-card point-1">
          <h3 className="point-title">📍 Point 1</h3>
          <input
            type="number"
            className="coordinate-input"
            value={position1[0]}
            onChange={(e) => handleCoordinateChange(setPosition1, 0, e.target.value, 'lat')}
            step="0.000001"
            placeholder="Enter latitude"
          />
          <input
            type="number"
            className="coordinate-input"
            value={position1[1]}
            onChange={(e) => handleCoordinateChange(setPosition1, 1, e.target.value, 'lng')}
            step="0.000001"
            placeholder="Enter longitude"
          />
          <button 
            className="btn btn-randomize btn-randomize-1"
            onClick={() => setPosition1(generateRandomCoordinate())}
          >
            🎲 Randomize Point 1
          </button>
        </div>

        {}
        <div className="point-card point-2">
          <h3 className="point-title">📍 Point 2</h3>
          <input
            type="number"
            className="coordinate-input"
            value={position2[0]}
            onChange={(e) => handleCoordinateChange(setPosition2, 0, e.target.value, 'lat')}
            step="0.000001"
            placeholder="Enter latitude"
          />
          <input
            type="number"
            className="coordinate-input"
            value={position2[1]}
            onChange={(e) => handleCoordinateChange(setPosition2, 1, e.target.value, 'lng')}
            step="0.000001"
            placeholder="Enter longitude"
          />
          <button 
            className="btn btn-randomize btn-randomize-2"
            onClick={() => setPosition2(generateRandomCoordinate())}
          >
            🎲 Randomize Point 2
          </button>
        </div>

        {}
        <div className="toggle-panel">
          <button 
            className={`btn btn-toggle ${lineVisible ? 'active' : ''}`}
            onClick={() => setLineVisible(!lineVisible)}
          >
            {lineVisible ? '🚫 Hide Connection' : '🔗 Show Connection'}
          </button>
        </div>

        {}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}
      </div>

      {}
      <MapContainer
        center={position1}
        zoom={13}
        className="map-wrapper"
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