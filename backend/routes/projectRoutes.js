import express from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import { authenticateJWT } from '../middleware/auth.js';
import { getFallbackProjects, createFallbackProject, deleteFallbackProject } from '../dbFallback.js';

const router = express.Router();

// GET /api/projects: fetch all projects from MongoDB
router.get('/', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    console.log('MongoDB offline, serving projects from fallback JSON.');
    const projects = getFallbackProjects().sort((a, b) => b.starCountFallback - a.starCountFallback);
    return res.json(projects);
  }

  try {
    const projects = await Project.find({}).sort({ starCountFallback: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Server error retrieving projects filesystem' });
  }
});

// POST /api/projects: protected route to insert a new repository item
router.post('/', authenticateJWT, async (req, res) => {
  const { title, slug, description, repoUrl, fileExtension, fileName, filePath, techStack, starCountFallback } = req.body;
  
  if (!title || !slug || !description || !repoUrl || !fileExtension || !fileName || !filePath) {
    return res.status(400).json({ error: 'Missing required repository payload fields (title, slug, description, repoUrl, fileExtension, fileName, filePath)' });
  }

  if (mongoose.connection.readyState !== 1) {
    console.log('MongoDB offline, inserting project into fallback JSON.');
    try {
      const newProject = createFallbackProject({
        title,
        slug,
        description,
        repoUrl,
        fileExtension,
        fileName,
        filePath,
        techStack: techStack || ["MERN_SHELL"],
        starCountFallback: starCountFallback || 1
      });
      return res.status(201).json(newProject);
    } catch (error) {
      return res.status(400).json({ error: error.message || 'Duplicate slug identifier already exists in system database' });
    }
  }

  try {
    const existingProject = await Project.findOne({ slug });
    if (existingProject) {
      return res.status(400).json({ error: 'Duplicate slug identifier already exists in system database' });
    }

    const newProject = new Project({
      title,
      slug,
      description,
      repoUrl,
      fileExtension,
      fileName,
      filePath,
      techStack,
      starCountFallback
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error inserting project:', error);
    res.status(500).json({ error: 'Server error writing project record to database' });
  }
});

// DELETE /api/projects/slug/:slug: protected route to delete a repository item
router.delete('/slug/:slug', authenticateJWT, async (req, res) => {
  const { slug } = req.params;

  if (mongoose.connection.readyState !== 1) {
    console.log('MongoDB offline, deleting project from fallback JSON.');
    const deletedProject = deleteFallbackProject(slug);
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found with the specified slug' });
    }
    return res.json({ success: true, message: `Project '${slug}' deleted successfully`, project: deletedProject });
  }

  try {
    const deletedProject = await Project.findOneAndDelete({ slug });
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found with the specified slug' });
    }
    res.json({ success: true, message: `Project '${slug}' deleted successfully`, project: deletedProject });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Server error removing project record from database' });
  }
});

export default router;
