import express from 'express';
import bodyParser from 'body-parser';
import loadRoutes from './loaders/routes.js';
import errorMiddleware from './middlewares/error.js';
import configureSwagger from "./swagger/config.js";

const app = express();

app.use(bodyParser.json());
loadRoutes(app);
app.use(errorMiddleware);

// Swagger config
configureSwagger(app);

export default app;
