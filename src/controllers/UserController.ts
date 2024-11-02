import User from "../models/Users";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

class UserController {
  registerUser = async (req: Request, res: Response) => {
    try {
      const { username, email, password } = await req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      // TODO: Check if username exists in DB
      const existingUserEmail = await User.findOne({ email });
      const existingUsername = await User.findOne({ username });

      if (existingUserEmail) {
        throw new Error("Email is already in use");
      }

      if (existingUsername) {
        throw new Error("An account with this username already exists");
      }

      if (username.includes(" ")) {
        throw new Error("Cannot use spaces in username");
      }

      await User.create({ username, email, password: hashedPassword });

      return res.status(200).json({ message: "User created!" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  loginUser = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        throw new Error("Cannot find an account with this username");
      }

      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (!passwordsMatch) {
        throw new Error("Invalid password");
      }

      return res.status(200).json({ data: user });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
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

  getProfilePicture = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      return res.status(200).json({ data: user.profilePicture });
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
      const user = await User.findOne({ username });
      return res.status(200).json({
        data: {
          username: user.username,
          profilePicture: user.profilePicture,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          _id: user._id,
        },
      });
    } catch (error) {
      return res.sendStatus(400);
    }
  };
}

export default new UserController();
