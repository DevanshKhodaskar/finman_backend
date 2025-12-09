import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import {connectDB} from './connection/db.js';
import authRoutes from './routes/auth.js'
import queriesRoutes from './routes/queries.js'
import reportsRoutes from './routes/reports.js'
import USER from './models/user.js';
import QUERY from './models/query.js';
import cookieParser from "cookie-parser";
import { requireAuth } from './middleware/authMiddleware.js';

dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin:["https://finmanagent.vercel.app","http://localhost:5173"] ,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

  app.get('/', (req, res) => res.send('FinMan backend Running'));

  app.use('/api/auth', authRoutes);
  app.use('/api/queries',requireAuth, queriesRoutes);
  app.use('/api/reports', reportsRoutes);

  // app.get('/test', async(req, res) => {
  //   try {
  //     const allUsers = await USER.find({});
  //     return res.json({ok:true, allUsers});
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({error: "server error"});
  //   }
  // });
  // app.get('/queries', async(req, res) => {
  //   try {
  //     const allQueries = await QUERY.find({});
  //     return res.json({ok:true, allQueries});
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({error: "server error"});
  //   }
  // });

  app.listen(PORT, async () => {
    
    console.log(`FinMan backend running on port http://localhost:${PORT}`);
});
export default app;
