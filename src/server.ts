import * as express from "express"
import * as morgan from "morgan"
import helmet from "helmet"
import * as compression from "compression"
import * as cors from "cors"
const app = express()

// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(cors)

// init routers

// handle errors

export default app