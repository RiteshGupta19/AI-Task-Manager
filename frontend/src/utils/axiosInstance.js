import axios from 'axios';
import Swal from 'sweetalert2';


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // required for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Handle expired access token and refresh it
axiosInstance.interceptors.response.use(
  (response) => {
   
    if (response.status === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data?.message || 'Created successfully',
        timer: 2000,
        showConfirmButton: false,
      });
    }

    return response;
  },

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // If token expired and not already retrying
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/refresh-token`, {
          withCredentials: true,
        });

        const newToken = res.data.accessToken;

       

        // Update token in localStorage and retry original request
        localStorage.setItem('accessToken', newToken);
        axiosInstance.defaults.headers.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh token also expired or invalid
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Please login again.',
        });

        localStorage.removeItem('accessToken');
        window.location.href = '/auth/signin';
        return Promise.reject(refreshError);
      }
    }

    // Generic error handler
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred.',
    });

    return Promise.reject(error);
  }
);

export default axiosInstance;
