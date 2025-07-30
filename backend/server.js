const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const app = express();

// Connect to database
const startServer = async () => {
  try {
    await connectDB();

    // Init middleware
    app.use(cors());
    app.use(express.json({ extended: false }));
    app.use(mongoSanitize());
    app.use(helmet());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again after 15 minutes',
    });
    app.use('/api/auth', limiter, require('./routes/auth.routes'));
    app.use('/api/users', require('./routes/user.routes'));
    app.use('/api/workspaces', require('./routes/workspace.routes'));
    app.use('/api/projects', require('./routes/project.routes'));
    app.use('/api/pathways', require('./routes/pathway.routes'));
    app.use('/api/links', require('./routes/link.routes'));
    app.use('/api/videos', require('./routes/video.routes'));
    app.use('/api/documents', require('./routes/document.routes'));
    app.use('/api/search', require('./routes/search.routes'));
    app.use('/api/dashboard', require('./routes/dashboard.routes'));
    app.use('/api/folders', require('./routes/folder.routes'));

    const errorHandler = require('./middleware/error.middleware');
    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
      .on('error', (err) => {
        console.error('Server startup error:', err);
        process.exit(1);
      });
  } catch (err) {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  }
};

startServer();
