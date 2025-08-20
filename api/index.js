import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { errorHandler, notFound } from "../middlewares/errorHandler.js";
import schoolRoutes from "./../routes/schoolRoutes.js"
import { initializeDatabase } from "../database/db.js";

dotenv.config()
const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-production-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

async function main(){

  await initializeDatabase() 
}

main()

app.use('/api', schoolRoutes);

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the School Management API',
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the School Management API. Here are the available endpoints:',
    endpoints: [
      {
        endpoint: '/api/addSchool',
        method: 'POST',
        description: 'Adds a new school to the database.',
        payload: {
          name: 'String',
          address: 'String',
          latitude: 'Number',
          longitude: 'Number'
        }
      },
      {
        endpoint: '/api/listSchools',
        method: 'GET',
        description: 'Fetches all schools, sorted by distance from the user.',
        parameters: {
          latitude: 'Number',
          longitude: 'Number'
        },
        example: '/api/listSchools?latitude=22.7196&longitude=75.8577'
      }
    ]
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;