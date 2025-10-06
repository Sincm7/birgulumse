export const getBrowserLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });

export const initialLocationState = {
  latitude: null,
  longitude: null,
  city: '',
  district: '',
  neighborhood: ''
};

export const formatAddress = ({ city, district, neighborhood }) =>
  [neighborhood, district, city].filter(Boolean).join(', ');
