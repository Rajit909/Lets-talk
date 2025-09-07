import express from 'express';
import cookieParser from 'cookie-parser'
import connectDb from './lib/config/db.js';
import { redisClient } from './lib/config/redisdb.js';
import userRoutes from './routes/user.route.js'
import { connectRabbitMQ } from './lib/config/rabbitmq.js';
import cors from "cors"

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors())

// const corsOptions = {
//     origin:'http://localhost:3000',
//     credentials:true
// }

connectDb()
redisClient
connectRabbitMQ();
 

//user routes
app.use("/api/v1", userRoutes)


app.get('/', (_, res) => {   
    res.send('Hello World!');
});

export default app;