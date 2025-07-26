import { useState } from 'react';

// API endpoint URL'lerini merkezi yönetim için
export const API_ENDPOINTS = {
  POINT: 'http://localhost:5075/api/point',
  LINE: 'http://localhost:5075/api/line',
  POLYGON: 'http://localhost:5075/api/polygon'
};

// Tüm API çağrılarını yöneten ana hook
const useApi = () => {
  const [loading, setLoading] = useState(false);

  // Tüm API çağrıları için ortak fonksiyon - hata yönetimi ve loading state dahil
  const apiCall = async (url, options = {}) => {
    setLoading(true);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        let errorDetails = '';
        try {
          const errorText = await response.text();
          try {
            const errorJson = JSON.parse(errorText);
            errorDetails = errorJson.message || errorJson.error || errorText;
          } catch {
            errorDetails = errorText;
          }
        } catch (parseError) {
          errorDetails = `HTTP ${response.status} ${response.statusText}`;
        }
        
        throw new Error(`API Error: ${response.status} - ${errorDetails}`);
      }
      
      // 204 No Content durumunda JSON parse etme
      if (response.status === 204) {
        return null;
      }
      
      const responseData = await response.json();
      return responseData;
      
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Point veri tipi için CRUD işlemleri
  const pointApi = {
    create: (data) => apiCall(API_ENDPOINTS.POINT, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (data) => apiCall(API_ENDPOINTS.POINT, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
    delete: (id) => apiCall(`${API_ENDPOINTS.POINT}/${id}`, {
      method: 'DELETE'
    }),
    search: (keyword) => apiCall(`${API_ENDPOINTS.POINT}/search?keyword=${encodeURIComponent(keyword)}`)
  };

  // Line veri tipi için CRUD işlemleri
  const lineApi = {
    create: (data) => apiCall(API_ENDPOINTS.LINE, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (data) => apiCall(API_ENDPOINTS.LINE, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
    delete: (id) => apiCall(`${API_ENDPOINTS.LINE}/${id}`, {
      method: 'DELETE'
    }),
    search: (keyword) => apiCall(`${API_ENDPOINTS.LINE}/search?keyword=${encodeURIComponent(keyword)}`)
  };

  // Polygon veri tipi için CRUD işlemleri
  const polygonApi = {
    create: (data) => apiCall(API_ENDPOINTS.POLYGON, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (data) => apiCall(API_ENDPOINTS.POLYGON, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
    delete: (id) => apiCall(`${API_ENDPOINTS.POLYGON}/${id}`, {
      method: 'DELETE'
    }),
    search: (keyword) => apiCall(`${API_ENDPOINTS.POLYGON}/search?keyword=${encodeURIComponent(keyword)}`)
  };

  // Harici API servisleri (şehir geocoding vb.)
  const externalApi = {
    geocodeCity: async (city) => {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
      const data = await response.json();
      if (!data.length) {
        throw new Error('Şehir bulunamadı.');
      }
      return data[0];
    }
  };

  return {
    loading,
    apiCall,
    pointApi,
    lineApi,
    polygonApi,
    externalApi
  };
};

export default useApi;