import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, TextField, Button, Stack,
  FormControl, InputLabel, Select, MenuItem, CircularProgress
} from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import axiosInstance from '../../utils/axiosInstance';
import Swal from 'sweetalert2';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    priorityId: '',
    subTasks: [],
    attachment: null,
    status: '',
  });

  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [customTask, setCustomTask] = useState('');

  // Fetch priorities separately
  const fetchPriorities = async () => {
    try {
      const res = await axiosInstance.get('/priorities');
      setPriorities(res.data.priorities || []);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to load priorities',
        text: err.response?.data?.message || 'Something went wrong',
      });
    }
  };

  // Fetch task details separately
  const fetchTask = async () => {
    try {
      const res = await axiosInstance.get(`/task/${id}`);
      const task = res.data.task;
      setFormData({
        title: task.title || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        priorityId: task.priorityId?._id || '',
        status: task.status || '',
        attachment: task.attachment || null,
        subTasks: task.subTasks || [],
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to load task',
        text: err.response?.data?.message || 'Something went wrong',
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    // Call both fetch functions in parallel and wait for both
    Promise.all([fetchPriorities(), fetchTask()])
      .finally(() => setLoading(false));
  }, [id]);



  const handleAddSubTask = () => {
    if (customTask.trim()) {
      setFormData(prev => ({
        ...prev,
        subTasks: [...prev.subTasks, customTask.trim()],
      }));
      setCustomTask('');
    }
  };

  const handleDeleteSubTask = (index) => {
    setFormData(prev => ({
      ...prev,
      subTasks: prev.subTasks.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'attachment' && files.length > 0) {
      setFormData(prev => ({ ...prev, attachment: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setButtonLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('dueDate', formData.dueDate);
      data.append('priorityId', formData.priorityId);
      data.append('status', formData.status);

      formData.subTasks.forEach((task, idx) => {
        data.append(`subTasks[${idx}]`, task);
      });

      if (formData.attachment) {
        data.append('attachment', formData.attachment);
      }

      await axiosInstance.put(`/update-task/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/user/manage-task');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setButtonLoading(false); // stop loader
    }
  };

  const isFileObject = (attachment) =>
    attachment && typeof attachment === 'object' && attachment instanceof File;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: "#13AA52" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        px: { xs: 0, md: 4 },
        py: { xs: 1, md: 4 },
        maxWidth: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Paper

        sx={{
          width: { xs: '100%', lg: '75%' },
          p: { xs: 0, sm: 3, md: 5 },
          borderRadius: 4,
          boxShadow: {
            xs: 'none',         // no shadow on small screens
            sm: '0px 1px 3px rgba(0,0,0,0.2), 0px 1px 1px rgba(0,0,0,0.14), 0px 2px 1px rgba(0,0,0,0.12)' // equivalent to elevation 3
          }
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h5" fontWeight={600}>
            Edit Task
          </Typography>

          <TextField
            label="Main Title"
            fullWidth
            size="small"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <Box
            display="flex"
            gap={2}
            alignItems="center"
            sx={{
              flexDirection: { xs: 'column', sm: 'row' }, // stack on xs, row from sm and above
              width: '100%',
            }}
          >
            <TextField
              label="Write a Task"
              fullWidth
              size="small"
              value={customTask}
              onChange={(e) => setCustomTask(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={handleAddSubTask}
              sx={{
                width: { xs: '100%', sm: '200px' },
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                color: 'green',
                border: '1px solid green',
                '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.4)' },
              }}
            >
              Add Task
            </Button>
          </Box>

          {formData.subTasks.length > 0 && (
            <Stack spacing={1}>
              <Typography fontWeight={600}>Task List</Typography>
              {formData.subTasks.map((task, i) => (
                <Box
                  key={i}
                  sx={{
                    borderBottom: '1px solid #eee',
                    pb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography>{task}</Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteSubTask(i)}
                    sx={{ minWidth: 30, px: 1 }}
                  >
                    ✕
                  </Button>
                </Box>
              ))}
            </Stack>
          )}
          <FormControl fullWidth>
            <InputLabel size="small" id="priority-label">
              Priority
            </InputLabel>
            <Select
              labelId="priority-label"
              size="small"
              name="priorityId"
              value={formData.priorityId}
              label="Priority"
              onChange={handleChange}
            >
              {priorities.map((p) => (
                <MenuItem key={p._id} value={p._id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            select
            label="Status"
            name="status"
            size="small"
            value={formData.status || ''}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In-Progress">In Progress</MenuItem>
            <MenuItem value="Complete">Complete</MenuItem>
          </TextField>

          <TextField
            label="Due Date"
            type="date"
            size="small"
            fullWidth
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          <Box>
            <Button variant="outlined" component="label" startIcon={<UploadFile />}>
              Upload New Attachment
              <input
                hidden
                type="file"
                accept="image/*,application/pdf"
                name="attachment"
                onChange={handleChange}
              />
            </Button>

            {formData.attachment && (
              <Box mt={2}>
                <Typography fontWeight={500} mb={1}>
                  Preview:
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 300,
                    height: 200,
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fafafa',

                  }}
                >


                  {isFileObject(formData.attachment) ? (
                    formData.attachment.type.startsWith('image') ? (
                      <Box
                        component="img"
                        src={URL.createObjectURL(formData.attachment)}
                        alt="Attachment Preview"
                        sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    ) : formData.attachment.type === 'application/pdf' ? (
                      <iframe
                        src={URL.createObjectURL(formData.attachment)}
                        title="PDF Preview"
                        width="100%"
                        height="100%"
                        style={{ border: 'none' }}
                      />
                    ) : (
                      <Typography color="error">Unsupported file type</Typography>
                    )
                  ) : formData.attachment.includes('.pdf') ? (
                    <iframe
                      src={`${formData.attachment}#toolbar=0&navpanes=0`}
                      title="PDF Preview"
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                    />
                  ) : (
                    <Box
                      component="img"
                      src={formData.attachment}
                      alt="Attachment Preview"
                      sx={{ maxHeight: 400, maxWidth: 500, objectFit: 'contain' }}
                    />
                  )}
                </Box>
              </Box>
            )}

          </Box>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            disabled={buttonLoading}
          >
            {buttonLoading ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : (
              'Save'
            )}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default EditTask;
