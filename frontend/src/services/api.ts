import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartbridge_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Device {
  id: number;
  device_id: str;
  name: string;
  device_type: string;
  status: string;
  firmware_version: string;
  last_seen: string;
}

export interface TelemetryPoint {
  timestamp: string;
  temperature: number;
  humidity: number;
  power_mw: number;
  relay_status: number;
}
