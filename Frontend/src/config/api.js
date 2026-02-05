// API Configuration
const API_CONFIG = {
  // Use environment variable if available, otherwise fallback to localhost
  BASE_URL: 'http://localhost:8080/api'
  // BASE_URL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:8080/api'
};

console.log('API_CONFIG loaded:', API_CONFIG);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

export default API_CONFIG;