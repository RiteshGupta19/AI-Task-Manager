import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DoneIcon from '@mui/icons-material/Done';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LoopIcon from '@mui/icons-material/Loop';
import axiosInstance from '../../utils/axiosInstance';

const statusIcons = {
  total: <AssignmentIcon fontSize="large" color="primary" />,
  Complete: <DoneIcon fontSize="large" color="success" />,
  Pending: <HourglassEmptyIcon fontSize="large" color="warning" />,
  'In-Progress': <LoopIcon fontSize="large" color="info" />,
};

const UserDashboard = () => {
  const [taskCounts, setTaskCounts] = useState({
    total: 0,
    Complete: 0,
    Pending: 0,
    'In-Progress': 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchTaskStats = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/count/task');
      setTaskCounts(data);
    } catch (err) {
      console.error('Error fetching task stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskStats();
  }, []);

  const cards = [
    { title: 'Total Tasks', key: 'total' },
    { title: 'Completed Tasks', key: 'Complete' },
    { title: 'Pending Tasks', key: 'Pending' },
    { title: 'In Progress Tasks', key: 'In-Progress' },
  ];

  return (
    <Box px={1} py={1}>
     
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress sx={{ color: '#13AA52' }} />
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {cards.map(({ title, key }) => (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <Card
                sx={{
                  height: 150,
                  minWidth: 280,
                  borderRadius: 3,
                  boxShadow: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    {statusIcons[key]}
                    <Box>
                      <Typography variant="subtitle1">{title}</Typography>
                      <Typography variant="h4">{taskCounts[key]}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default UserDashboard;
