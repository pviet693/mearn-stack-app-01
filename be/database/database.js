import mongoose from "mongoose";

mongoose.set("strictQuery", true);
async function connect() {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME,
            user: process.env.DB_USER,
            pass: process.env.DB_PASS
        });
        console.log("Connect mongoose successfully");
        return connection;
    } catch (error) {
        const { code } = error;
        if (error.code == 8000) {
            throw new Error("Wrong DB username or password");
        }
        if (code == "ENOTFOUND") {
            throw new Exception("Wrong connection string");
        }

        throw new Exception("Cannot connect to MongoDB");
    }
}

export default connect;