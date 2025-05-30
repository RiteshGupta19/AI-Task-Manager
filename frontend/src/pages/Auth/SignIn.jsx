import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Fade,
  CircularProgress
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import registerData from '../../assets/registerData.json';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const SignIn = () => {
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      Swal.fire('Missing Fields', 'Please enter both email and password', 'warning');
      return;
    }

    setLoading(true); 

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/sign-in`, data, {
        withCredentials: true,
      });

      const { accessToken, message } = res.data;

      login(accessToken);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: message,
        timer: 1000,
        showConfirmButton: false,
      }).then(() => {
        navigate('/user/dashboard');
      });

    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || 'Something went wrong';
      const errors = err.response?.data?.errors;

      if (status === 400 && errors && Array.isArray(errors)) {
        Swal.fire({
          icon: 'error',
          title: msg,
          html: `<ul style="text-align: center; list-style: none; padding-left: 0;">${errors.map(err => `<li>${err}</li>`).join('')}</ul>`,
        });
      } else {
        Swal.fire('Login Failed', msg, 'error');
      }
    } finally {
      setLoading(false); // End loading
    }
  };



  return (
    <>
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

        }}
      >
        <Box
          component="section"
          sx={{
            px: { xs: 2, sm: 6, md: 10 },
            py: { xs: 6, md: 10 },
            bgcolor: '#fff',
            maxHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

          }}
        >
          <Grid container spacing={20} alignItems="center" justifyContent="center">
            <Fade in={true} timeout={1000}>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: {
                    xs: 'none',
                    lg: 'flex',
                  },
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    height: { xs: 300, md: 400 },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Lottie
                    animationData={registerData}
                    loop
                    autoplay
                    style={{ width: '100%', height: '100%' }}
                  />
                </Box>
              </Grid>
            </Fade>
            <Fade in={true} timeout={1000}>
              <Grid item xs={12} md={6}>

                <Box
                  sx={{
                    maxWidth: 400,
                    margin: 'auto',
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#fff',
                  }}
                >
                  <Typography variant="h5" align="center" gutterBottom>
                    Sign In
                  </Typography>

                  <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      required
                      label="Email"
                      name="email"
                      value={data.email}
                      onChange={handleChange}
                      margin="dense"
                      variant="standard"
                      size="small"
                      InputLabelProps={{ required: true }}
                    />

                    <TextField
                      fullWidth
                      required
                      label="Password"
                      type="password"
                      name="password"
                      value={data.password}
                      onChange={handleChange}
                      margin="dense"
                      variant="standard"
                      size="small"
                      InputLabelProps={{ required: true }}
                    />


                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      size="small"
                      disabled={loading} // disable while loading
                      sx={{
                        mt: 2,
                        backgroundColor: '#13AA52',
                        '&:hover': { backgroundColor: '#0e8d44' },
                        color: '#fff',
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                      ) : (
                        'Sign In'
                      )}
                    </Button>


                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                      Don't have an account?{' '}
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate('/auth/signup')}
                        sx={{ textTransform: 'none', padding: 0, minWidth: 'auto', color: '#13AA52' }}
                      >
                        Sign Up
                      </Button>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Fade>
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default SignIn;
