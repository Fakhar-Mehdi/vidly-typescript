import { NextFunction, Request, Response } from "express";
import w from "winston";

const error = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (res.statusCode === 200) res.status(500);
  w.error(`\n\n${error.text}\nERROR: ${error.e.message}`);
  res.send(`\n\n${error.text}\nERROR: ${error.e.message}`);
  next();
};

export default error;
