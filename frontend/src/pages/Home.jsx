import React from 'react'
import HeroSection from '../components/Home/HeroSection';
import Header from '../components/Home/Header'
import { Box, Fade } from '@mui/material';

const Home = () => {
  return (
    <>
     <Fade in={true} timeout={500}>
      <Box sx={{ minHeight: '100vh' }}>
        <Header />
        <HeroSection />
      </Box>
      </Fade>
    </>
  )
}

export default Home;
