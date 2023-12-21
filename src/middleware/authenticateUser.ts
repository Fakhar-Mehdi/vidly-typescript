import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      res.status(401);
      throw new Error("No Token Found");
    }
    const decoded = jwt.verify(token, String(process.env.vidly_jwtPrivateKey));
    req = Object.assign(req, { user: decoded });

    next();
  } catch (e: any) {
    if (res.statusCode === 200) res.status(400);
    console.log(`Invalid Token\nERROR: ${e.message}`);
    res.send(`Invalid Token\nERROR: ${e.message} `);
  }
};

export default authenticateUser;
