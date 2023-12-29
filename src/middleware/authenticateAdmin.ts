import {  Response, NextFunction } from "express";
import w from "winston";

const authenticateAdmin = (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.user.isAdmin) {
      res.status(403);
      throw new Error("Access Denied\nYou're not an Admin\n");
    }
    next();
  } catch (e: any) {
    if (res.statusCode === 200) res.status(400);
    w.error(`Invalid Token\nERROR: ${e.message}`);
    res.send(`Invalid Token\nERROR: ${e.message} `);
  }
};

export default authenticateAdmin;
