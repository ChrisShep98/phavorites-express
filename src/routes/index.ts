import express from "express";
import UserController from "../controllers/UserController";
import SongController from "../controllers/SongController";
import MiscController from "../controllers/MiscController";
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const router = express.Router();
app.use("/uploads", express.static("uploads"));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "uploads", // The name of the folder in Cloudinary
  allowedFormats: ["jpg", "png", "jpeg"],
});

//Oldcode that stored images in the node.js server
// const storage = multer.diskStorage({
//   destination: function (req: any, file: any, cb: any) {
//     cb(null, "uploads");
//   },
//   filename: function (req: any, file: any, cb: any) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     // cb(null, file.fieldname + "-" + uniqueSuffix);
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });
const upload = multer({ storage });

// router.get("/user/:id", UserController.getUserById);
router.get("/", MiscController.welcomePage);
router.get("/user/:username", UserController.getUserByUsername);
router.post("/login", UserController.loginUser);
router.post("/register", UserController.registerUser);
router.put(
  "/uploadProfilePic/:id",
  upload.single("profilePicture"),
  UserController.uploadProfilePicture
);
router.get("/getProfilePicture/:id", UserController.getProfilePicture);

router.post("/songSubmittion", SongController.submitSong);
router.post("/addComment/:postId", SongController.addComment);
router.patch("/:id/upVote", SongController.updateVoteCount);
router.get("/comments/:postId", SongController.getComments);
router.get("/submissions", SongController.getSubmissions);

export default router;
