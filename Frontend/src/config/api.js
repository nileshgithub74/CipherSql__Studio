// API Configuration
const API_CONFIG = {

  BASE_URL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : ''
};

console.log('API_CONFIG loaded:', API_CONFIG);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

export default API_CONFIG;