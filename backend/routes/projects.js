const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Project = require('../models/Project');
const User = require('../models/User');

// Create a project (Creator becomes Admin)
router.post('/', protect, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Automatically make the creator an admin, but maybe update their role globally? 
    // The requirement says "create projects (creator becomes Admin)". 
    // Let's update the user's role if they are not admin already.
    await User.findByIdAndUpdate(req.user.id, { role: 'Admin' });

    const newProject = new Project({
      name,
      description,
      admin: req.user.id,
      members: [req.user.id] // admin is also a member
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's projects
router.get('/', protect, async (req, res) => {
  try {
    // If Admin, maybe see all their projects. Members see assigned ones.
    // The query finds any project where user is a member.
    const projects = await Project.find({ members: req.user.id }).populate('admin', 'name email').populate('members', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin adds a member
router.post('/:projectId/members', protect, async (req, res) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized. Only project admin can add members.' });
    }

    const member = await User.findOne({ email });
    if (!member) return res.status(404).json({ message: 'User not found' });

    if (project.members.includes(member._id)) {
      return res.status(400).json({ message: 'User already in project' });
    }

    project.members.push(member._id);
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin removes a member
router.delete('/:projectId/members/:memberId', protect, async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId);
  
      if (!project) return res.status(404).json({ message: 'Project not found' });
      
      if (project.admin.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
  
      project.members = project.members.filter(m => m.toString() !== req.params.memberId);
      await project.save();
  
      res.json(project);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
