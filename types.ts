import type { FeatureCollection, Feature } from 'geojson';

export interface MapLayer {
  id: string;
  name: string;
  data: FeatureCollection;
  isVisible: boolean;
}

export type AiAction = 'ADD_LAYER' | 'INFO' | 'ERROR';

export interface AiResponse {
  action: AiAction;
  layerName?: string;
  geojsonData?: FeatureCollection;
  message?: string;
}

export interface AiResponseMessage {
    id: string;
    sender: 'user' | 'bot';
    content: string;
    action?: AiAction;
}

export interface NearestInfo {
    feature: Feature | null;
    distance: number | null;
}

export interface SectorInfo {
    nearestSchool: NearestInfo;
    nearestHospital: NearestInfo;
}

export interface AirbaseLocation {
  name: string;
  coordinates: [number, number]; // [lat, lng]
}

export interface NearestAirbaseInfo {
  airbase: AirbaseLocation | null;
  distance: number | null;
}

export interface TimeSeriesDataPoint {
  year: number;
  month: number;
  date: string; // "YYYY-MM"
  no2: number;
  ntl: number;
}

export interface AirbaseTimeSeries {
  [key: string]: TimeSeriesDataPoint[];
}