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
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const company_1 = __importDefault(require("../models/company"));
const emailSender_1 = require("../utils/emailSender");
const router = express_1.default.Router();
exports.authRouter = router;
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyName, email, mobile, password } = req.body;
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const company = new company_1.default({
        companyName,
        email,
        mobile,
        password: hashedPassword,
    });
    yield company.save();
    const verificationToken = jsonwebtoken_1.default.sign({ companyId: company._id }, process.env.AUTH_SECRET || "", { expiresIn: "1h" });
    const verificationUrl = `http://yourdomain.com/verify-email?token=${verificationToken}`;
    try {
        yield (0, emailSender_1.sendEmailVerificationLink)({ email, verificationToken });
        res.send("Company registered. Please verify your email.");
    }
    catch (error) {
        res.status(500).json({ error: "Failed to send verification email" });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const company = yield company_1.default.findOne({ email });
        if (company) {
            const result = yield bcryptjs_1.default.compare(password, company.password);
            if (result) {
                const token = jsonwebtoken_1.default.sign({ companyId: company._id }, process.env.AUTH_SECRET || "");
                res.json({ token });
            }
            else {
                res.status(400).json({ error: "Password doesn't match" });
            }
        }
        else {
            res.status(400).json({ error: "Company doesn't exist" });
        }
    }
    catch (error) {
        res.status(400).json({ error });
    }
}));
//@ts-ignore
router.get("/verify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(400).json({ error: "Authorization header is required" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(400).json({ error: "Token is required" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.AUTH_SECRET || "");
        if (typeof payload === "object" && payload.companyId) {
            const company = yield company_1.default.findById(payload.companyId);
            if (!company) {
                return res.status(404).json({ error: "Company not found" });
            }
            company.verified = true;
            yield company.save();
            return res.status(200).json({ message: "Email verified successfully" });
        }
        else {
            return res.status(400).json({ error: "Invalid token" });
        }
    }
    catch (error) {
        console.error("Error verifying email", error);
        return res
            .status(500)
            .json({ error: "An error occurred during verification" });
    }
}));
