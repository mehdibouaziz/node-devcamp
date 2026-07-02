import express from 'express';
import morgan from "morgan";
import fileUpload from 'express-fileupload';
import path from 'path';
import {fileURLToPath} from 'url';
import cookieParser from "cookie-parser";
//routers
import bootcampsRouter from './feat/bootcamps/bootcamp.route.ts';
import coursesRouter from './feat/courses/course.route.ts';
import authRouter from './feat/auth/auth.route.ts';
import usersRouter from './feat/users/user.route.ts';
import reviewsRouter from './feat/reviews/review.route.ts';
// utils
import errorHandler from './middleware/error.ts';


const app = express();

app.set('query parser', 'extended');

// middleware
app.use(express.json());

// cookies middleware
app.use(cookieParser());

// logger middleware
if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// File upload middleware
app.use(fileUpload());
// Set static folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../public')));

// routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/bootcamps', bootcampsRouter);
app.use('/api/v1/courses', coursesRouter);
app.use('/api/v1/reviews', reviewsRouter);

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'Hello World'
    })
});


// error handler
app.use(errorHandler);

export default app;
