import { Request, Response } from "express";

export type ITryBlock = (req: Request, res: Response) => void;
