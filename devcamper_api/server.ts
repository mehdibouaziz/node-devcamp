import express from 'express';
import 'dotenv/config';

import bootcampsRouter from './routes/bootcamps.ts'

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/api/v1/bootcamps', bootcampsRouter);

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'Hello World'
    })
})

app.listen(
    PORT,
    () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode at http://localhost:${PORT}`)
    }
);