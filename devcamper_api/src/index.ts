import express from 'express';

import bootcampsRouter from './feat/bootcamps/route.ts'

export const app = express();

app.use('/api/v1/bootcamps', bootcampsRouter);

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'Hello World'
    })
});
