import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';

export default function Header() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };


  const drawerContent = (
    <Box
      sx={{
        width: 250,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        pt: 3, // Padding from top
      }}
      onClick={toggleDrawer(false)}
    >
      <List>
        {['Home', 'About', 'Contact'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              sx={{
                px: 3,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#1e1e1e',
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>
                    {text}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>


      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ my: 2, borderColor: '#333' }} />
        <NavLink to="/auth/signin" style={{ textDecoration: 'none' }}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              mb: 1,
              backgroundColor: '#13AA52',
              '&:hover': { backgroundColor: '#0e8d44' },
              color: '#fff',
            }}
          >
            Sign In
          </Button>
        </NavLink>
        <NavLink to="/auth/signup" style={{ textDecoration: 'none' }}>
          <Button
            fullWidth
            variant="outlined"
            sx={{
              borderColor: '#13AA52',
              color: '#13AA52',
              '&:hover': {
                backgroundColor: 'rgba(19, 170, 82, 0.1)',
                borderColor: '#13AA52',
              },
            }}
          >
            Sign Up
          </Button>
        </NavLink>
      </Box>
    </Box>
  );





  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#fff' }}>
        <Toolbar>
          {/* Mobile drawer menu */}
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}


          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            PaperProps={{
              sx: {
                backgroundColor: '#121212', // Dark grey (better than pure black for contrast)
                color: '#fff',               // White text
              }
            }}
          >
            {drawerContent}
          </Drawer>
        <Typography
  variant="h5"
  component="div"
  sx={{
    color: '#13AA52',
    flexGrow: 1,
    fontWeight: 'bold',
    letterSpacing: 1,
  }}
>
  TaskMaster
</Typography>

          {/* Show buttons only on desktop */}
          {!isMobile && (
            <>
              <NavLink to="/auth/signin" style={{ textDecoration: 'none', marginRight: 8 }}>
                <Button
                  sx={{
                    backgroundColor: '#13AA52',
                    '&:hover': { backgroundColor: '#0e8d44' },
                    color: '#fff',
                  }}
                >
                  Sign In
                </Button>
              </NavLink>
              <NavLink to="/auth/signup" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" color="inherit"

                  sx={{
                    borderColor: '#13AA52',
                    color: '#13AA52',
                    '&:hover': {
                      backgroundColor: 'rgba(19, 170, 82, 0.1)',
                      borderColor: '#13AA52',
                    },
                  }}>
                  Sign Up
                </Button>
              </NavLink>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
