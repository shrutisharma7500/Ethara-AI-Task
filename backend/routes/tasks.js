const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Task = require('../models/Task');
const Project = require('../models/Project');

// Dashboard metrics
router.get('/dashboard', protect, async (req, res) => {
  try {
    const userProjects = await Project.find({ members: req.user.id });
    const projectIds = userProjects.map(p => p._id);

    // If Admin, can see all tasks in their projects.
    // If Member, can see their assigned tasks.
    let filter = {};
    if (req.user.role === 'Admin') {
      filter = { project: { $in: projectIds } };
    } else {
      filter = { assignedTo: req.user.id };
    }

    const tasks = await Task.find(filter);

    const totalTasks = tasks.length;
    const tasksByStatus = {
      'To Do': tasks.filter(t => t.status === 'To Do').length,
      'In Progress': tasks.filter(t => t.status === 'In Progress').length,
      'Done': tasks.filter(t => t.status === 'Done').length,
    };

    const tasksPerUser = {};
    tasks.forEach(t => {
      if (t.assignedTo) {
        tasksPerUser[t.assignedTo] = (tasksPerUser[t.assignedTo] || 0) + 1;
      }
    });

    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;

    res.json({
      totalTasks,
      tasksByStatus,
      tasksPerUser, // might need to populate names in a real app, but count is ok for now
      overdueTasks
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tasks for a project
router.get('/project/:projectId', protect, async (req, res) => {
  try {
    let filter = { project: req.params.projectId };
    // Members only see their tasks? The prompt says "Members can view assigned projects", "view and update assigned tasks only".
    if (req.user.role !== 'Admin') {
      filter.assignedTo = req.user.id;
    }
    
    const tasks = await Task.find(filter).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, dueDate, priority, project, assignedTo } = req.body;
    
    // Check project admin
    const proj = await Project.findById(project);
    if (!proj) return res.status(404).json({ message: 'Project not found' });

    if (proj.admin.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Only admin can create tasks' });
    }

    const task = new Task({
      title, description, dueDate, priority, project, assignedTo
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task status (and other details if admin)
router.put('/:taskId', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const proj = await Project.findById(task.project);

    // Only Admin or Assigned Member can update
    const isAdmin = proj.admin.toString() === req.user.id;
    const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user.id;

    if (!isAdmin && !isAssigned) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!isAdmin) {
      // Member can only update status
      if (req.body.status) task.status = req.body.status;
    } else {
      // Admin can update anything
      if (req.body.title) task.title = req.body.title;
      if (req.body.description) task.description = req.body.description;
      if (req.body.dueDate) task.dueDate = req.body.dueDate;
      if (req.body.priority) task.priority = req.body.priority;
      if (req.body.status) task.status = req.body.status;
      if (req.body.assignedTo) task.assignedTo = req.body.assignedTo;
    }

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
