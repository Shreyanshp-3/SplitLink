import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";


import groupRoutes from "./routes/groupRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/groups", groupRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => {
    res.send("API Running");
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");

        app.listen(process.env.PORT, () => {
            console.log(`Server running on ${process.env.PORT}`);
        });
    })
    .catch((err) => console.log(err));