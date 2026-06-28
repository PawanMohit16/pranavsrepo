import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECTS_FILE = path.join(__dirname, 'projects_db.json');
const MESSAGES_FILE = path.join(__dirname, 'messages_db.json');

import { defaultProjects } from './defaults.js';

export const getFallbackProjects = () => {
  try {
    if (!fs.existsSync(PROJECTS_FILE)) {
      fs.writeFileSync(PROJECTS_FILE, JSON.stringify(defaultProjects, null, 2));
      return defaultProjects;
    }
    const data = fs.readFileSync(PROJECTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading fallback projects file:', err);
    return defaultProjects;
  }
};

export const createFallbackProject = (projectData) => {
  try {
    const projects = getFallbackProjects();
    const slug = projectData.slug;
    if (projects.some(p => p.slug === slug)) {
      throw new Error('Duplicate slug');
    }
    const newProject = {
      ...projectData,
      _id: new Date().getTime().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    projects.push(newProject);
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
    return newProject;
  } catch (err) {
    console.error('Error saving fallback project:', err);
    throw err;
  }
};

export const deleteFallbackProject = (slug) => {
  try {
    const projects = getFallbackProjects();
    const index = projects.findIndex(p => p.slug === slug);
    if (index === -1) return null;
    const deleted = projects[index];
    projects.splice(index, 1);
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
    return deleted;
  } catch (err) {
    console.error('Error deleting fallback project:', err);
    throw err;
  }
};

export const getFallbackMessages = () => {
  try {
    if (!fs.existsSync(MESSAGES_FILE)) {
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading fallback messages file:', err);
    return [];
  }
};

export const createFallbackMessage = (messageData) => {
  try {
    const messages = getFallbackMessages();
    const newMessage = {
      ...messageData,
      _id: new Date().getTime().toString(),
      timestamp: new Date().toISOString()
    };
    messages.push(newMessage);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    return newMessage;
  } catch (err) {
    console.error('Error saving fallback message:', err);
    throw err;
  }
};
