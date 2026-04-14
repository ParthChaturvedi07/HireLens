import { app } from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/config/database.js";
dotenv.config();
connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});