import dotenv from "dotenv"
import connectDB from "./utiles/connectionDB.js";
import { app } from './app.js'
import UserRouter from "./routes/user.route.js";
import JobRouter from "./routes/job.route.js"
import CompanayRouter from "./routes/company.route.js"
import ApplicationRouter from "./routes/application.route.js"



dotenv.config({
    path: './.env'
})



connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port : ${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.log("MONGO db connection failed !!! ", error);
    })

// router
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/job", JobRouter);
app.use("/api/v1/company", CompanayRouter);
app.use("/api/v1/application", ApplicationRouter);
