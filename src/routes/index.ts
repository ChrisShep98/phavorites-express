import express from "express";
import UserController from "../controllers/UserController";
import SongController from "../controllers/SongController";

const router = express.Router();

router.get("/user/:id", UserController.getUserById); // not needed?
router.post("/login", UserController.loginUser);
router.post("/register", UserController.registerUser);

router.post("/songSubmittion", SongController.submitSong);
router.post("/addComment/:postId", SongController.addComment);
router.get("/allSubmissions", SongController.getAllSubmissions);
router.patch("/:id/upVote", SongController.updateVoteCount);

export default router;
