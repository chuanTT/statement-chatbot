import * as express from "express";
import * as morgan from "morgan";
import helmet from "helmet";
import * as compression from "compression";
import * as cors from "cors";
import { NotFound } from "http-errors";
import reasonPhrases from "./utils/reasonPhrases";
import statusCodes from "./utils/statusCodes";

const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init routers

// handle errors
app.use(
  (
    _req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) => {
    next(NotFound());
  }
);
const errorHandler: express.ErrorRequestHandler = (err, _req, res, _next) => {
  const status = err.status || statusCodes.INTERNAL_SERVER_ERROR;
  res.status(status).json({
    status,
    message: err.message || reasonPhrases.INTERNAL_SERVER_ERROR,
  });
};

app.use(errorHandler);

export default app;
