import express, { Request, Response, NextFunction } from 'express';
import { FRONTEND_URL, FRONTEND_URL_2, FRONTEND_URL_3, PORT } from './config/config';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.route';
import educationRoutes from './routes/education.route';
import experienceRoutes from './routes/experience.routes';
import jobRoutes from './routes/jobs.route';
import analyticsRoutes from './routes/analytics.route';
import paymentRoutes from './routes/payment.routes';
import sessionRoutes from './routes/session.route';
import sessionBookingRoutes from './routes/sessionBooking.route';
import resumeRoutes from './routes/resume.route';
import resumeUploadRoutes from './routes/resumeUpload.route';
import new_resumeRoutes from './routes/new_resume.route';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import sequelize from './config/db';
import logger from './utils/logger';
import cluster from 'cluster';
import os from 'os';
import { updateUserSubscriptionSimple } from "./controllers/payment.controller";

// Import User model for direct payment update route
import User from './models/user.model';

// Cache environment variables
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      subscription_type: string;
      subscription_type_2: string;
      phone_number: string;
      resume?: boolean;
      referral?: boolean;
      cold_mail?: boolean;
      cover_letter?: boolean;
      hr_mail?: boolean;
      linkedin?: boolean;
      cv?: boolean;
      roadmaps?: boolean;
      interview?: boolean;
      job?: boolean;
    }

    interface Admin {
      id: string;
      email: string;
    }

    interface Request {
      user?: User;
      admin?: Admin;
    }
  }
}

const ALLOWED_ORIGINS = [FRONTEND_URL, FRONTEND_URL_2, FRONTEND_URL_3].filter(Boolean) as string[];
const NODE_ENV = process.env.NODE_ENV || 'production';
const IS_PRODUCTION = NODE_ENV === 'production';
const CPU_CORES = os.cpus().length;

// Rate limiter configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// Cluster setup for load balancing
if (cluster.isPrimary && IS_PRODUCTION) {
  logger.info(`Primary process ${process.pid} is running`);

  // Fork workers for each CPU core
  for (let i = 0; i < CPU_CORES; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died with code ${code}, signal ${signal}. Restarting...`);
    cluster.fork();
  });
} else {
  const app = express();

  // Middleware
  app.use(compression()); // Compress responses
  app.use(limiter); // Apply rate limiting
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Security headers with helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", ...ALLOWED_ORIGINS],
        },
      },
    })
  );

  // Declare global Express types
  

  // Routes
  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      message: 'Foundit API up and running',
    });
  });

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/education', educationRoutes);
  app.use('/api/v1/experience', experienceRoutes);
  app.use('/api/v1/job', jobRoutes);
  app.use('/api/v1/analytics', analyticsRoutes);  app.use('/api/v1/session', sessionRoutes);
  app.use('/api/v1/session/booking', sessionBookingRoutes);
  app.use('/api/v1/resume', resumeRoutes);
  app.use('/api/v1/resume-upload', resumeUploadRoutes);
  app.use('/api/v1/payment', paymentRoutes);
  app.use('/api/v1/new/resume', new_resumeRoutes);
  // Direct payment update route

  app.post('/update', updateUserSubscriptionSimple);
  

  // Global error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`${err.message} - ${req.method} ${req.url}`);
    res.status(err.status || 500).json({
      success: false,
      message: IS_PRODUCTION ? 'Internal Server Error' : err.message,
    });
  });

  // Start server
  app.listen(PORT, async () => {
    try {
      await sequelize.authenticate(); // Test DB connection
      // await sequelize.sync({ force: false }); // Uncomment if schema sync is needed
      logger.info(`Worker ${process.pid} running on port ${PORT}`);
    } catch (err:any) {
      logger.error(`Database connection failed: ${err.message}`);
      process.exit(1);
    }
  });
}