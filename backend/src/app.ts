import express, { Request, Response } from "express";
import { PORT } from "./config/config";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.route";
import educationRoutes from "./routes/education.route";
import experienceRoutes from "./routes/experience.routes";
import jobRoutes from "./routes/jobs.route";
import analyticsRoutes from "./routes/analytics.route";
import paymentRoutes from "./routes/payment.routes";
import sessionRoutes from "./routes/session.route";
import sessionBookingRoutes from "./routes/sessionBooking.route";
import resumeRoutes from "./routes/resume.route";
import new_resumeRoutes from "./routes/new_resume.route";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import sequelize from "./config/db";
const app = express();

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan("dev"));
app.use(helmet());

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      subscription_type: string;
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
app.get("/", (req : Request, res: Response) => {
  res.status(200).json({
    message: "Foundit API up and running",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/education", educationRoutes);
app.use("/api/v1/experience", experienceRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/session", sessionRoutes);
app.use("/api/v1/session/booking", sessionBookingRoutes);
app.use("/api/v1/resume", resumeRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/new/resume", new_resumeRoutes);

app.listen(PORT, async () => {
  // await sequelize.sync({force : true});
  console.log(`Server is running on port ${PORT}`);
});
