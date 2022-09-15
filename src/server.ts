import express, { Application } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { notFound, errorHandler } from './services/ErrorHandler.service';
import router from './routes';
import { config } from 'dotenv';
import connectToDatabase from './config/ConnectToDB.config';
import { Logger } from './library/Logging.library';

// dotenv
config();

// connect to database
connectToDatabase();

const app: Application = express();

// middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());

// route
app.use(router);

// error handler
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, (): void => {
    Logger.info(`Listen at Port ${process.env.PORT}`);
});
