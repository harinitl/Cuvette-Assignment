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
exports.sendEmailVerificationLink = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: process.env.SENDER_EMAIL || "",
        pass: process.env.EMAIL_SEC_KEY || "",
    },
});
const sendEmailVerificationLink = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, verificationToken, }) {
    const mailOptions = {
        from: {
            name: "Harini from Job Portal",
            address: process.env.SENDER_EMAIL || "",
        },
        to: email,
        subject: "Email Confirmation",
        text: "Please click on the link below to verify your email",
        html: `<p>Hello!</p>
      <p>Thank you for signing up with Job portal. Please confirm your email by clicking the link below:</p>
      <a href="https://main.d3vpmerazlv5va.amplifyapp.com/auth/confirmEmail?token=${verificationToken}">Confirm Email</a>
      <p>Best regards,</p>
      <p>Job Portal</p>`,
    };
    try {
        yield exports.transporter.sendMail(mailOptions);
        console.log("Email verification mail sent successfully");
    }
    catch (error) {
        console.error("Error sending email verification mail", error);
    }
});
exports.sendEmailVerificationLink = sendEmailVerificationLink;
