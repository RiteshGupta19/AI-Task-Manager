import { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Stack,
  FormControl, InputLabel, Select, MenuItem, CircularProgress, Skeleton
} from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import axiosInstance from '../../utils/axiosInstance';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import usePriorities from '../../hooks/usePriorities';

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    priorityId: '',
    subTasks: [],
    attachment: null,
  });
  const [customTask, setCustomTask] = useState('');

  const [suggestedTasks, setSuggestedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const navigate = useNavigate();
 const priorities = usePriorities();


  const handleAddSubTask = () => {
    if (customTask.trim()) {
      setFormData(prev => ({
        ...prev,
        subTasks: [...prev.subTasks, customTask.trim()],
      }));
      setCustomTask('');
    }
  };

  const handleSuggest = async () => {
    setLoading(true);  // <-- start loading
    try {
      const res = await axiosInstance.post('/suggest-tasks', { title: formData.title });
      setSuggestedTasks(res.data.suggestions || []);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to get suggestions',
        text: err.response?.data?.error || 'Something went wrong',
      });
    } finally {
      setLoading(false);  // <-- stop loading
    }
  };

  const handleAddSuggestedTask = (task) => {
    if (!formData.subTasks.includes(task)) {
      setFormData(prev => ({
        ...prev,
        subTasks: [...prev.subTasks, task],
      }));
    }
  };



  const handleSubmit = async () => {
    setButtonLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('dueDate', formData.dueDate);
      data.append('priorityId', formData.priorityId);


      formData.subTasks.forEach((task, idx) => {
        data.append(`subTasks[${idx}]`, task);
      });

      if (formData.attachment) {
        data.append('attachment', formData.attachment);
      }

      await axiosInstance.post('/create-task', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/user/manage-task');

      // Reset form
      setFormData({
        title: '',
        dueDate: '',
        priorityId: '',
        subTasks: [],
        attachment: null,
      });
      setSuggestedTasks([]);
      setCustomTask('');

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setButtonLoading(false); // stop loader
    }
  };


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
          <Typography variant="h5" fontWeight={600}>Create a New Task</Typography>

          <TextField
            label="Title"
            fullWidth
            size="small"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
          <Button variant="outlined" onClick={handleSuggest} disabled={!formData.title}>
            Suggest Tasks
          </Button>
          <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, md: 2 }, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>Suggested Tasks</Typography>

            {loading ? (
              <Stack spacing={1}>
                <Skeleton variant="rectangular" height={40} />
                <Skeleton variant="rectangular" height={40} />
                <Skeleton variant="rectangular" height={40} />
              </Stack>
            ) : (
              suggestedTasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Suggestions will appear here after clicking the Suggest Tasks button.
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {suggestedTasks.map((task, index) => (
                    <Box
                      key={index}
                      sx={{
                        border: '1px solid #ddd',
                        borderRadius: 2,
                        p: 1.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography>{task}</Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleAddSuggestedTask(task)}
                        sx={{ minWidth: 36 }}
                      >
                        +
                      </Button>
                    </Box>
                  ))}
                </Stack>

              )
            )}
          </Paper>
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
                // py: { xs: 1, sm: 1 },
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                color: 'green',
                border: '1px solid green',
                '&:hover': {
                  backgroundColor: 'rgba(76, 175, 80, 0.4)',
                },
              }}
            >
              Add Task
            </Button>
          </Box>

          {formData.subTasks.length > 0 && (
            <Stack spacing={1}>
              <Typography fontWeight={600}>Task List</Typography>
              {formData.subTasks.map((task, i) => (
                <Box key={i} sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
                  <Typography>{task}</Typography>
                </Box>
              ))}
            </Stack>
          )}

          <FormControl fullWidth required>
            <InputLabel size="small" required>Priority</InputLabel>
            <Select
              size="small"
              value={formData.priorityId}
              label="Priority"
              onChange={(e) => setFormData(prev => ({ ...prev, priorityId: e.target.value }))}
            >
              {priorities.map((p) => (
                <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Due Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
          />

          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFile />}
            >
              Upload Attachment
              <input
                hidden
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFormData(prev => ({ ...prev, attachment: file }));
                }}
              />
            </Button>

            {formData.attachment && (
              <Box mt={2}>
                <Typography fontWeight={500} mb={1}>Preview:</Typography>
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
                  {formData.attachment.type.startsWith('image') ? (
                    <Box
                      component="img"
                      src={URL.createObjectURL(formData.attachment)}
                      alt="Attachment Preview"
                      sx={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : formData.attachment.type === 'application/pdf' ? (
                    <iframe
                      src={`${URL.createObjectURL(formData.attachment)}#toolbar=0&navpanes=0&scrollbar=0`}
                      title="PDF Preview"
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                    />
                  ) : (
                    <Typography color="error">Unsupported file type</Typography>
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

export default CreateTask;
