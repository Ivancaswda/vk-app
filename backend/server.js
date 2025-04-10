import express from 'express'
import dotenv from 'dotenv'
import authRouter from "./routes/authRoute.js";
import userRouter from './routes/userRoute.js';
import postRouter from './routes/postRoute.js'
import notificationRouter from "./routes/notificationRoute.js";
import connectionRouter from "./routes/connectionRouter.js";
import messageRouter from "./routes/messageRoute.js";
import cookieParser from 'cookie-parser'
import {connectDb} from "./lib/mongodb.js";
import {connectCloudinary} from "./lib/cloudinary.js";
import cors from 'cors'
import path from 'path'
import {app, server} from "./authMiddlewares/socket.js";

const PORT =  4023
const __dirname = path.resolve()
dotenv.config()


connectCloudinary()
app.use(express.json({limit: '5mb'})) // limit for the image resolution
const allowedOrigins = [
    'http://localhost:5174',
    'https://vk-app-kappa.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(cookieParser())

app.use('/api/auth', authRouter)

app.use('/api/user', userRouter)

app.use('/api/post', postRouter)

app.use('/api/notification', notificationRouter)

app.use('/api/connection', connectionRouter)

app.use('/api/message', messageRouter)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist')))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}

server.listen(PORT, async () => {
    console.log(`Сервер запущен на порте ${PORT}`)
    connectDb()

})
