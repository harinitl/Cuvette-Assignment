import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  company?: string;
}

const isLoggedIn = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      if (token) {
        const payload = (await jwt.verify(
          token,
          process.env.AUTH_SECRET || ""
        )) as JwtPayload;

        if (payload && payload.companyId) {
          req.company = payload.companyId;
          next();
        } else {
          res
            .status(400)
            .json({ error: "Token verification failed or missing companyId" });
        }
      } else {
        res.status(400).json({ error: "Malformed auth header" });
      }
    } else {
      res.status(400).json({ error: "No authorization header" });
    }
  } catch (error) {
    res.status(400).json({ error: "An error occurred" });
  }
};

export default isLoggedIn;
