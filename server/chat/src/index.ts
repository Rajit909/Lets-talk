import express from 'express';
import cookieParser from 'cookie-parser'
import connectDb from './lib/config/db.js';

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// const corsOptions = {
//     origin:'http://localhost:3000',
//     credentials:true
// }

connectDb()
// redisClient
// connectRabbitMQ();




app.get('/', (_, res) => {   
    res.send('Hello World!');
});

export default app;