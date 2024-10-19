"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobRouter = void 0;
const express_1 = __importDefault(require("express"));
const job_1 = __importDefault(require("../models/job"));
const company_1 = __importDefault(require("../models/company"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
exports.jobRouter = router;
router.post("/add", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, experienceLevel, endDate } = req.body;
    console.log("abc", req.company);
    const checkCompany = yield company_1.default.findById(req.company);
    console.log("bbd", checkCompany);
    if (!checkCompany) {
        return res.status(404).json({ error: "Company not found." });
    }
    if (!checkCompany.verified) {
        return res
            .status(403)
            .json({ error: "You must verify your email before posting jobs." });
    }
    const job = new job_1.default({
        title,
        description,
        experienceLevel,
        endDate,
        company: req.company,
    });
    yield job.save();
    res.status(200).json("Job added successfully");
}));
router.get("/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allJobs = yield job_1.default.find().populate("company");
        res.status(200).json(allJobs);
    }
    catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
}));
