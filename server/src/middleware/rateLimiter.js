import { rateLimit } from "express-rate-limit";

// Limit each IP to 100 requests per window (here, per 15 minutes)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes"
  }
});
