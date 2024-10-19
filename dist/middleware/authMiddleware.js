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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            if (token) {
                const payload = (yield jsonwebtoken_1.default.verify(token, process.env.AUTH_SECRET || ""));
                if (payload && payload.companyId) {
                    req.company = payload.companyId;
                    next();
                }
                else {
                    res
                        .status(400)
                        .json({ error: "Token verification failed or missing companyId" });
                }
            }
            else {
                res.status(400).json({ error: "Malformed auth header" });
            }
        }
        else {
            res.status(400).json({ error: "No authorization header" });
        }
    }
    catch (error) {
        res.status(400).json({ error: "An error occurred" });
    }
});
exports.default = isLoggedIn;
