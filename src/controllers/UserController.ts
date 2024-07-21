import User from "../models/Users";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

class UserController {
  registerUser = async (req: Request, res: Response) => {
    try {
      const { username, email, password } = await req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      // TODO: Check if username exists in DB
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        // return new Response("Email is already in use", { status: 400 });
        return res.status(400).json({ message: "Email is already in use" });
      }

      await User.create({ username, email, password: hashedPassword });

      return res.status(200).json({ message: "User created!" });
    } catch (error) {
      return res.sendStatus(400);
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      return res.status(200).json({ data: user });
    } catch (error) {
      return res.sendStatus(400);
    }
  };
}

export default new UserController();
