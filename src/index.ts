import { AppDataSource } from "./data-source"
import app from "./server"
const PORT = 3001

AppDataSource.initialize().then(async () => {
    app.listen(PORT, () => console.log(`server lister port:${PORT} `))
}).catch(error => console.log(error))
