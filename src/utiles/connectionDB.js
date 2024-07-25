import mongoose from "mongoose"

const connectDB = async function () {
    try {
        const database = await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database connected successfully");
    } catch (error) {
        console.log("error in database connection", error);
    }
}

export default connectDB