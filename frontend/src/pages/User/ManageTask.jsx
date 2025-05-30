import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Stack,
  IconButton,
  TextField,
  MenuItem,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import usePriorities from '../../hooks/usePriorities';
import Swal from 'sweetalert2';
import axiosInstance from '../../utils/axiosInstance'; // adjust this import to your axios setup
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';


const priorityColor = {
  High: 'error',
  Medium: 'warning',
  Low: 'success',
};

const ManageTask = () => {
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    status: '',
    priorityId: '',
    searchQuery: ''
  });


  const navigate = useNavigate();
 const priorities = usePriorities();

 
  const fetchTasks = async () => {
    try {
      setLoading(true); // start loading
      const params = {};

      if (formData.status && formData.status !== 'All') params.status = formData.status;
      if (formData.priorityId) params.priorityId = formData.priorityId;

      if (formData.searchQuery && formData.searchQuery.trim() !== '') {
        params.searchQuery = formData.searchQuery.trim();
      }

      const res = await axiosInstance.get('/tasks', { params });
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to load tasks',
        text: err.response?.data?.error || 'Something went wrong',
      });
    } finally {
      setLoading(false); // end loading
    }
  };


  useEffect(() => {
    fetchTasks();
  }, [formData]);


  const handleSearchChange = _.debounce((value) => {
    setFormData((prev) => ({ ...prev, searchQuery: value }));
  }, 500);



  const handleDelete = async (taskId) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This task will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await axiosInstance.delete(`/delete/task/${taskId}`);

        fetchTasks(); // refresh task list
      } catch (err) {
        console.error('Delete failed:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to delete task',
          text: err.response?.data?.message || 'Something went wrong',
        });
      }
    }
  };

  const handleEdit = (taskId) => {
    navigate(`/user/edit-task/${taskId}`);
  };


  return (
    <>
      <Box sx={{ p: { xs: '0px', sm: '15px' } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexWrap="wrap"
          spacing={{ xs: 0, sm: 0 }}
        >
          <Stack sx={{ pb: '10px' }}>
            <TextField
              variant="outlined"
              label="Search task by Title"
              size="small"
              onChange={(e) => handleSearchChange(e.target.value)}
              sx={{
                width: { xs: '87vw', md: '300px' },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#13AA52',
                  },
                },
              }}
            />

          </Stack>

          <Stack direction="row" spacing={{ xs: 1, sm: 2 }} sx={{ pb: '10px' }}>
            <TextField
              select
              size="small"
              label="Filter by Status"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
              sx={{ minWidth: { xs: 150, sm: 180 } }} // fixed width
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In-Progress">In Progress</MenuItem>
              <MenuItem value="Complete">Complete</MenuItem>
            </TextField>
            <TextField
              select
              size="small"
              label="Filter by Priority"
              value={formData.priorityId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, priorityId: e.target.value }))
              }
              sx={{ minWidth: { xs: 160, sm: 180 } }}
            >

              <MenuItem value="All">
                All
              </MenuItem>

              {/* Priority options */}
              {priorities.map((p) => (
                <MenuItem key={p._id} value={p._id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>

        <Grid container spacing={4} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                minHeight: '300px',
              }}
            >
              <CircularProgress sx={{ color: "#13AA52" }} />
            </Box>
          ) : tasks.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                minHeight: '300px',
                textAlign: 'center',
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="No Tasks"
                width="140"
                style={{ marginBottom: '16px' }}
              />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No tasks to show
              </Typography>
              <Typography variant="body2" color="textSecondary">
                There are no tasks available or matching your selected filters.
              </Typography>
            </Box>
          ) : (
            tasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task._id} >
                <Card sx={{ width: { xs: '320px', sm: '335px' }, height: '100%' }}>
                  <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"

                        spacing={1}
                        flexWrap="wrap"
                      >
                        <Chip
                          label={task.status}
                          color={task.status === 'Complete' ? 'success' : 'warning'}
                        />
                        <Chip
                          label={`${task.priorityId?.name || task.priority} Priority`}
                          color={priorityColor[task.priorityId?.name || task.priority]}
                          variant="outlined"
                        />

                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"

                      >

                        <IconButton onClick={() => handleEdit(task._id)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(task._id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </Stack>

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                      }}
                    >
                      {task.title}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={4}
                      mt={2}
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Box>
                        <Typography variant="caption" fontWeight="bold">
                          Start Date:
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {task.createdAt ? format(new Date(task.createdAt), 'dd MMM yyyy') : 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight="bold">
                          Due Date:
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {task.dueDate ? format(new Date(task.dueDate), 'dd MMM yyyy') : 'N/A'}
                        </Typography>
                      </Box>
                    </Stack>

                    {task.attachment && (
                      <Box mt={2} sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="textSecondary">
                          📎 {task.attachment.name || 'Attachment'}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

      </Box>
    </>
  );
};

export default ManageTask;
