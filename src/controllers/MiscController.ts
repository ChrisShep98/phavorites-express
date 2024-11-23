import { Request, Response } from "express";
const path = require("path");

class MiscController {
  welcomePage = async (req: Request, res: Response) => {
    console.log(path.join(__dirname, "../..", "public", "index.html"));
    return res.sendFile(path.join(__dirname, "../..", "public", "index.html"));
  };
}

export default new MiscController();
