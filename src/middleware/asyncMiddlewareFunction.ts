import { NextFunction, Request, Response } from "express";
import { ITryBlock } from "../helper/types";

export const asyncMiddlewareFunction = (
  tryBlock: ITryBlock,
  message: string = ""
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await tryBlock(req, res);
    } catch (e) {
      next({ e, text: message });
    }
  };
};
