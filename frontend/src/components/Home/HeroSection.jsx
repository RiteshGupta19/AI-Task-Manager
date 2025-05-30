import { Box, Grid, Typography, Button } from "@mui/material";
import Lottie from "lottie-react";
import animationData from "../../assets/HeroAnimation.json";
import { NavLink } from 'react-router-dom';

export default function HeroSection() {
  return (
    <Box
      component="section"
      sx={{
        px: { xs: 2, sm: 2, md: 2, lg:10 },
        py: { xs: 10, sm:10, md: 10 },
      }}
    >
      <Grid container spacing={10} alignItems="center" justifyContent="center">
        {/* Left Side: Text */}
        <Grid item xs={12} md={6}>
          <Box  sx={{
            maxWidth: {
              xs: "100%",   
              md: 397,      
              lg: 500, 
            },
          }}>
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ lineHeight: 1.2 }}
            >
              Stay Organized. Get Things Done.
            </Typography>
            <Typography
              variant="h6"
              color="#666"
              sx={{ mt: 2, lineHeight: 1.5 }}
            >
              Manage your daily tasks efficiently with AI-powered suggestions,
              deadlines, priorities, and categories — all in one place.
            </Typography>

            <Box sx={{ mt: 4 }}>
              <NavLink to="/user/dashboard" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#13AA52",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#0e8d44",
                  },
                  borderRadius: 2,
                  px: 5,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                Get Started
              </Button>
              </NavLink>
            </Box>
          </Box>
        </Grid>

        {/* Right Side: Lottie Animation */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: {
                xs: "absolute",  
                md: "relative",  
              },
              top: {
                xs: 0,
                md: "auto",
              },
              left: {
                xs: 0,
                md: "auto",
              },
              width: {
                xs: "100%",
                md: "100%",
              },
              height: {
                xs: "100vh",
                md: 400,
              },
              maxWidth: {
                md: 500,
              },
              mx: {
                md: "auto",
              },
              zIndex: {
                xs: -1,
                md: "auto",
              },
              overflow: "hidden",
              display: {
                xs: "none",    
                md: "block",   
              },
            }}
          >
            <Lottie
              animationData={animationData}
              loop={true}
              autoplay={true}
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
          </Grid>

      </Grid>
    </Box>
  );
}
