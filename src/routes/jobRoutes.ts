import express, { Request, Response } from "express";
import Job from "../models/job";
import Company from "../models/company";
import isLoggedIn from "../middleware/authMiddleware";

interface CustomRequest extends Request {
  company?: any;
}

const router = express.Router();

router.post(
  "/add",
  isLoggedIn,
  async (req: CustomRequest, res: Response): Promise<any> => {
    const { title, description, experienceLevel, endDate } = req.body;
    console.log("abc", req.company);

    const checkCompany = await Company.findById(req.company);
    console.log("bbd", checkCompany);
    if (!checkCompany) {
      return res.status(404).json({ error: "Company not found." });
    }

    if (!checkCompany.verified) {
      return res
        .status(403)
        .json({ error: "You must verify your email before posting jobs." });
    }

    const job = new Job({
      title,
      description,
      experienceLevel,
      endDate,
      company: req.company,
    });

    await job.save();
    res.status(200).json("Job added successfully");
  }
);

router.get("/get", async (req: CustomRequest, res: Response) => {
  try {
    const allJobs = await Job.find().populate("company");
    res.status(200).json(allJobs);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

export { router as jobRouter };
