import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDB} from './config/db.js';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';

import { clerkMiddleware } from '@clerk/express'
import { createServer } from 'http';
import { initializeSocket } from './config/socket.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())

// SERVER
const httpServer= createServer(app);
initializeSocket(httpServer);

// 

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use("/api/user",userRoutes)
app.use("/api/posts",postRoutes)





if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {

    httpServer.listen(process.env.PORT, () => {
      console.log('❤  Server SOCKET!!! is running on port ' + process.env.PORT );
    })
    app.listen(process.env.PORT, () => {
      console.log('❤  Server is running on port ' + process.env.PORT );
    });
  });
}
export default app;