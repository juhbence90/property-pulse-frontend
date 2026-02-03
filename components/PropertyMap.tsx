'use client';

import { useEffect, useState } from 'react';
import { setDefaults, fromAddress, OutputFormat } from 'react-geocode';
import type { PropertyProps } from '@/models/Property';
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import Image from 'next/image';
import pin from '@/assets/images/pin.svg';
import Spinner from './Spinner';

const PropertyMap = ({ property }: PropertyProps) => {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [viewport, setViewport] = useState<{
    latitude: number;
    longitude: number;
    zoom: number;
  }>({
    latitude: 0,
    longitude: 0,
    zoom: 12,
  });
  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY;
  const mapToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!apiKey) {
    throw new Error('Missing Google Geocoding API key');
  }

  useEffect(() => {
    setDefaults({
      key: apiKey,
      language: 'en',
      region: 'us',
      outputFormat: OutputFormat.XML,
    });
  }, [apiKey]);

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const res = await fromAddress(
          `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`,
        );

        // Check geocode results
        if (res.results.length === 0) {
          setGeocodeError(true);
          return;
        }

        const { lat, lng } = res.results[0].geometry.location;
        setLat(lat);
        setLng(lng);
        setViewport({
          ...viewport,
          latitude: lat,
          longitude: lng,
        });
      } catch (error) {
        console.log(error);
        setGeocodeError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCoords();
  }, []);

  if (loading) return <Spinner />;

  if (geocodeError || lat === null || lng === null)
    return <div className="text-xl">No location data found</div>;

  return (
    <Map
      mapboxAccessToken={mapToken}
      mapLib={import('mapbox-gl')}
      initialViewState={viewport}
      style={{ width: '100%', height: 500 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <Marker longitude={lng} latitude={lat} anchor="bottom">
        <Image src={pin} alt="location" width={40} height={40} />
      </Marker>
    </Map>
  );
};

export default PropertyMap;
