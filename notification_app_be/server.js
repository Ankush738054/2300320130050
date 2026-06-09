import express from 'express';
import dotenv from 'dotenv';
import { loggingMiddleware } from '../logging_middleware/logger.js'; 
import notificationRoutes from './routes/routes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(loggingMiddleware);

app.use('/api', notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});