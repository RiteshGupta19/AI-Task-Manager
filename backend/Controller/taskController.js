// suggestController.js
const { OpenAI } = require('openai');
const cleanSuggestions = require('../validator/cleanSuggestions');
const Priority = require('../Model/prioritySchema');
const Task = require('../Model/taskSchema')
const { deleteFromGCS, getSignedUrl, uploadImageToGCS } = require('../utils/gcpMethod')
const mongoose = require('mongoose');


require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

const suggestTasks = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo", // OpenRouter model path
      messages: [
        { role: "system", content: "You are a helpful task manager assistant." },
        {
          role: "user",
          content: `Suggest 5 task titles based on the main project: "${title}". Only respond with a JSON array of short task titles, without any extra text or labels.`,

        },
      ],
    });

    const raw = completion.choices[0].message.content;
    const suggestions = cleanSuggestions(raw); 

    res.json({ suggestions });
  } catch (err) {
    console.error("OpenRouter error:", err);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
};


const createTask = async (req, res) => {
  try {
    const { title, priorityId, dueDate, subTasks } = req.body;

    const userId = req.user.userId;


    if (!title || !priorityId || !userId) {
      return res.status(400).json({ message: 'All Manadatory are required.' });
    }

    let attachmentPath = null;
    if (req.file) {
      try {
        attachmentPath = await uploadImageToGCS(req.file, "taskUpload/", userId);
      } catch (error) {
        console.error("GCS Upload Error:", error);
        return res.status(500).json({ message: "Failed to upload file to GCS" });
      }
    }

    const newTask = new Task({
      userId,
      title,
      priorityId,
      dueDate,
      subTasks,
      attachment: attachmentPath,
    });


    await newTask.save();

    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (err) {
    console.error('Task creation failed:', err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};


const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.userId;
    const { title, priorityId, dueDate, status, subTasks } = req.body;

    if (!title || !priorityId || !userId) {
      return res.status(400).json({ message: 'All Manadatory are required.' });
    }

    const existingTask = await Task.findOne({ _id: taskId, userId });
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    let attachmentPath = existingTask.attachment;

   
    if (req.file) {
      // Delete old file if it exists
      if (existingTask.attachment) {
        const oldFilePath = existingTask.attachment.replace(`https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/`, '');
        try {
          await deleteFromGCS(oldFilePath);
        } catch (deleteError) {
          console.error('Error deleting old file from GCS:', deleteError);
        }
      }

      // Upload new file
      attachmentPath = await uploadImageToGCS(req.file, "taskUpload/", userId);
    }

 
    existingTask.title = title;
    existingTask.priorityId = priorityId;
    existingTask.dueDate = dueDate;
    existingTask.status = status || existingTask.status;
    existingTask.subTasks = subTasks;
    existingTask.attachment = attachmentPath;

    await existingTask.save();

    res.status(201).json({ message: 'Task updated successfully', task: existingTask });
  } catch (err) {
    console.error('Task update failed:', err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};




const getSingleTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.userId; // assuming you're using auth middleware

    const task = await Task.findOne({ _id: taskId, userId }).populate('priorityId');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }


    let signedImageUrl = null;

    if (task?.attachment) {
      const url = await getSignedUrl(task.attachment);
      signedImageUrl = url;
    }

    task.attachment = signedImageUrl;

    res.status(200).json({ task });
  } catch (err) {
    console.error('Failed to fetch task:', err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};



const getTasks = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const { status, priorityId, searchQuery } = req.query;

    const query = { userId };

    if (status && status !== 'All') {
      query.status = status
    }


    if (priorityId && priorityId !== 'All') {
      query.priorityId = priorityId;
    }

    if (searchQuery) {
      query.title = { $regex: searchQuery, $options: 'i' }; // case-insensitive match
    }

    const tasks = await Task.find(query).populate('priorityId');

    res.status(200).json({ tasks });
  } catch (err) {
    console.error('Failed to fetch tasks:', err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};


const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.userId;

    const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId });

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    //  Delete attachment from GCS if it exists
    if (deletedTask.attachment) {
      const filePath = deletedTask.attachment.replace(`https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/`, '');
      try {
        await deleteFromGCS(filePath);
        console.log(`Attachment ${filePath} deleted from GCS.`);
      } catch (err) {
        console.error('Failed to delete attachment from GCS:', err);
      
      }
    }

    res.status(200).json({ message: 'Task and attachment deleted successfully' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const getPriorities = async (req, res) => {
  try {
    const priorities = await Priority.find();

    res.status(200).json({ priorities });
  } catch (error) {
    console.error('Failed to fetch priorities:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getTaskCounts = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Total task count
    const total = await Task.countDocuments({ userId });

    // Status-wise count
    const statusCounts = await Task.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Initialize with 0
    const countMap = {
      total,
      Pending: 0,
      "In-Progress": 0,
      Complete: 0,
    };

    // Map counts from aggregation result
    statusCounts.forEach((entry) => {
      if (countMap.hasOwnProperty(entry._id)) {
        countMap[entry._id] = entry.count;
      }
    });


    res.status(200).json(countMap);
  } catch (err) {
    console.error('Failed to fetch task counts:', err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};


module.exports = { suggestTasks, createTask, updateTask, getPriorities, getTasks, deleteTask, getSingleTask, getTaskCounts };
