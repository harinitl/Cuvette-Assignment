"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const jobRoutes_1 = require("./routes/jobRoutes");
const authRoutes_1 = require("./routes/authRoutes");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const mongoDBURL = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mydemoDB";
mongoose_1.default
    .connect(mongoDBURL)
    .then(() => {
    console.log("MongoDB Connection Successful");
})
    .catch((err) => {
    console.error("MongoDB Connection Error:", err);
});
app.use("/v1/api/auth", authRoutes_1.authRouter);
app.use("/v1/api/job", jobRoutes_1.jobRouter);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
