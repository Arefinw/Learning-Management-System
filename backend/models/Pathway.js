const mongoose = require('mongoose');

const pathwaySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  items: [
    {
      type: {
        type: String,
        enum: ['Link', 'Video', 'Document'],
        required: true,
      },
      content: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'items.type',
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
  ],
  parentPathway: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pathway',
  },
  subPathways: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pathway',
    },
  ],
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'project', 'folder'],
    default: 'private',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Pathway', pathwaySchema);
