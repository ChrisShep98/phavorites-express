import express from "express";
import UserController from "../controllers/UserController";
import SongController from "../controllers/SongController";

const router = express.Router();

// router.get("/user/:id", UserController.getUserById);
router.get("/user/:username", UserController.getUserByUsername);
router.post("/login", UserController.loginUser);
router.post("/register", UserController.registerUser);

router.post("/songSubmittion", SongController.submitSong);
router.post("/addComment/:postId", SongController.addComment);
router.get("/allSubmissions", SongController.getAllSubmissions);
router.patch("/:id/upVote", SongController.updateVoteCount);
router.get("/comments/:postId", SongController.getComments);
router.get("/song/:slug", SongController.getSubmissionsOfOneSong);

export default router;
