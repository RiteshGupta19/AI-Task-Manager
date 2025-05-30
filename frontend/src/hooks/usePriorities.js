import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Swal from 'sweetalert2';

function usePriorities() {
  const [priorities, setPriorities] = useState([]);

  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        const res = await axiosInstance.get('/priorities');
        setPriorities(res.data.priorities || []);
      } catch (err) {
        console.error('Failed to load priorities:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to load priorities',
          text: err.response?.data?.error || 'Something went wrong',
        });
      }
    };
    fetchPriorities();
  }, []);

  return priorities;
}

export default usePriorities;
