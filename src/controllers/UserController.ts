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

      if (username.includes(" ")) {
        return res.status(400).json({ message: "Cannot use spaces in username" });
      }

      await User.create({ username, email, password: hashedPassword });

      return res.status(200).json({ message: "User created!" });
    } catch (error) {
      return res.sendStatus(400);
    }
  };

  loginUser = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username: username });
      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (!user) {
        return res.sendStatus(400);
      } else if (!passwordsMatch) {
        return res.sendStatus(400);
      } else {
        return res.status(200).json({ data: user });
      }
    } catch (error) {
      return res.sendStatus(400);
    }
  };

  // When a user updates their profile pic the old one still stays in cloudinary.
  uploadProfilePicture = async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const cloudinaryImage = req.file.path;

      const user = await User.findByIdAndUpdate(id);

      user.profilePicture = cloudinaryImage;
      user.save();
      return res.json({ message: "Profile picture successfully updated" });
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

  // TODO: remove the email and password prop from getting sent back lol major security issue even with the hashed password. Don't send back the entire user schema
  getUserByUsername = async (req: Request, res: Response) => {
    try {
      const { username } = req.params;
      const user = await User.find({ username });
      return res.status(200).json({ data: user });
    } catch (error) {
      return res.sendStatus(400);
    }
  };
}

export default new UserController();
