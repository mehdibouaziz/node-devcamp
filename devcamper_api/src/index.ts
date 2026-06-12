import express from 'express';
import morgan from "morgan";

import bootcampsRouter from './feat/bootcamps/bootcamp.route.ts';
import coursesRouter from './feat/courses/course.route.ts';
import errorHandler from './middleware/error.ts';


const app = express();

app.set('query parser', 'extended');

// middleware
app.use(express.json());

// logger middleware
if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// routers
app.use('/api/v1/bootcamps', bootcampsRouter);
app.use('/api/v1/courses', coursesRouter);

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'Hello World'
    })
});


// error handler
app.use(errorHandler);

export default app;
