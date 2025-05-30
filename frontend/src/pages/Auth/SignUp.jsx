import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Grid,
  Fade,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Lottie from 'lottie-react';
import registerData from '../../assets/registerData.json';
import axios from 'axios';
import Swal from 'sweetalert2';


export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    tandc: false,
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
  });

  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    if (name === 'email') {
      setErrors((prev) => ({
        ...prev,
        email: !value.includes('@'),
      }));
    }

    if (name === 'password') {
      const isTooShort = value.length < 6;
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      setErrors((prev) => ({
        ...prev,
        password: isTooShort || !hasSpecialChar,
      }));
    }

    if (name === 'name') {
      setErrors((prev) => ({
        ...prev,
        name: value.trim().length === 0,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.name || errors.email || errors.password || !formData.tandc) {
      Swal.fire('Incomplete Form', 'Please fill all fields correctly and accept terms.', 'warning');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/sign-up`, formData);

      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message || 'User registered successfully',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate('/auth/signin');
        });
      }
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || 'Something went wrong';
      const errors = err.response?.data?.errors;

      if (status === 400 && errors && Array.isArray(errors)) {
        Swal.fire({
          icon: 'error',
          title: msg,
          html: `<ul style="text-align: center;  list-style: none; padding-left: 0;">${errors.map(e => `<li>${e}</li>`).join('')}</ul>`,
        });
      } else if (status === 409) {
        Swal.fire('Registration Failed', msg, 'error');
      } else {
        Swal.fire('Error', msg, 'error');
      }
    } finally {
      setLoading(false);
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
                    mx: 'auto',
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
                    Sign Up
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      helperText={errors.name ? 'Name is required' : ' '}
                      margin="dense"
                      variant="standard"
                      required
                      InputLabelProps={{ required: true }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      helperText={errors.email ? 'Enter a valid email' : ' '}
                      margin="dense"
                      variant="standard"
                      required
                      InputLabelProps={{ required: true }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      label="Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                      helperText={
                        errors.password
                          ? 'Password must be at least 6 characters and include a special character'
                          : ''
                      }
                      margin="dense"
                      variant="standard"
                      required
                      InputLabelProps={{ required: true }}
                    />


                    <FormControlLabel
                      control={
                        <Checkbox
                          name="tandc"
                          checked={formData.tandc}
                          onChange={handleChange}
                          sx={{ p: 0.5 }}
                        />
                      }
                      label="I agree with the Terms & Conditions"
                      sx={{ mt: 1 }}
                    />
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      size="small"
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
                        'Sign Up'
                      )}
                    </Button>
                  </Box>

                  <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Already have an account?{' '}
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => navigate('/auth/signin')}
                      sx={{
                        textTransform: 'none',
                        padding: 0,
                        minWidth: 'auto',
                        color: '#13AA52',
                      }}
                    >
                      Sign In
                    </Button>
                  </Typography>

                </Box>
              </Grid>
            </Fade>
          </Grid>
        </Box>
      </div>
    </>
  );
}
