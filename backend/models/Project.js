import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  repoUrl: {
    type: String,
    required: true,
    trim: true
  },
  fileExtension: {
    type: String,
    required: true,
    trim: true // e.g. '.cs', '.exe', '.py', '.java'
  },
  fileName: {
    type: String,
    required: true,
    trim: true // e.g. 'ChatBot.cs', 'TrafficModel.py'
  },
  filePath: {
    type: String,
    required: true,
    trim: true // e.g. 'src/Program.cs', 'main.py'
  },
  techStack: {
    type: [String],
    required: true,
    default: []
  },
  starCountFallback: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
