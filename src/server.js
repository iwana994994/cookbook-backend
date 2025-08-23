import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDB} from './config/db.js';
import userRoutes from './routes/user.route.js';


import { clerkMiddleware } from '@clerk/express'

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use("/api/user",userRoutes)





if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    app.listen(process.env.PORT, () => {
      console.log('❤  Server is running on port ' + process.env.PORT );
    });
  });
}
export default app;