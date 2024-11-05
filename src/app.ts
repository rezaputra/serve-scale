import express, { Application } from 'express';
import cors from "cors"

import scaleRoutes from './routes/scaleRoutes'
import errorMiddleware from './middlewares/errorMiddleware'
import { corsOptions } from './config/corsOptions';


const app: Application = express();

app.use(cors(corsOptions))
app.options("*", cors(corsOptions))

app.use(express.json());

app.use('/api/scale', scaleRoutes);

app.use(errorMiddleware);

export default app;
