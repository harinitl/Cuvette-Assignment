import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Company from "../models/company";
import { sendEmailVerificationLink } from "../utils/emailSender";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  const { companyName, email, mobile, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const company = new Company({
    companyName,
    email,
    mobile,
    password: hashedPassword,
  });

  await company.save();

  const verificationToken = jwt.sign(
    { companyId: company._id },
    process.env.AUTH_SECRET || "",
    { expiresIn: "1h" }
  );

  const verificationUrl = `http://yourdomain.com/verify-email?token=${verificationToken}`;

  try {
    await sendEmailVerificationLink({ email, verificationToken });
    res.send("Company registered. Please verify your email.");
  } catch (error) {
    res.status(500).json({ error: "Failed to send verification email" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ email });
    if (company) {
      const result = await bcrypt.compare(password, company.password);
      if (result) {
        const token = jwt.sign(
          { companyId: company._id },
          process.env.AUTH_SECRET || ""
        );
        res.json({ token });
      } else {
        res.status(400).json({ error: "Password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "Company doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

//@ts-ignore
router.get("/verify", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ error: "Authorization header is required" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const payload = jwt.verify(token, process.env.AUTH_SECRET || "");

    if (typeof payload === "object" && payload.companyId) {
      const company = await Company.findById(payload.companyId);

      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      company.verified = true;
      await company.save();

      return res.status(200).json({ message: "Email verified successfully" });
    } else {
      return res.status(400).json({ error: "Invalid token" });
    }
  } catch (error) {
    console.error("Error verifying email", error);
    return res
      .status(500)
      .json({ error: "An error occurred during verification" });
  }
});

export { router as authRouter };
