import SongVersions from "../models/SongVersions";
import { Request, Response } from "express";

// TO DO: add GET method for getting all submited songs and GET for specific songs

class SongController {
  submitSong = async (req: Request, res: Response) => {
    try {
      const {
        songName,
        date,
        venueName,
        venueLocation,
        userWhoPosted,
        description,
        slug,
      } = await req.body;

      const alreadyExists = await SongVersions.findOne({ date: date });

      if (alreadyExists) {
        return res.status(400).json({
          message: `This version was already posted by - ${alreadyExists.userWhoPosted}`,
        });
      }

      await SongVersions.create({
        songName,
        date,
        description,
        userWhoPosted,
        venueName,
        venueLocation,
        slug,
      });

      return res.status(200).json({ message: "Song version created!" });
    } catch (error) {
      return res.sendStatus(400);
    }
  };

  getAllSubmissions = async (req: Request, res: Response) => {
    try {
      const allSubmissions = await SongVersions.find();
      return res.status(200).json({ data: allSubmissions });
    } catch (error) {
      return res.sendStatus(400);
    }
  };

  updateVoteCount = async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      const { id } = req.params;
      const songSubmission = await SongVersions.findByIdAndUpdate(id);
      const usersWhoVoted = songSubmission.votedBy;

      if (usersWhoVoted.includes(userId)) {
        songSubmission.voteCount -= 1;

        // find userId in array and remove
        const index = usersWhoVoted.indexOf(userId);
        usersWhoVoted.splice(index, 1);

        songSubmission.save();
        return res.status(200).json({ message: "Down successfully removed!" });
      }

      songSubmission.voteCount += 1;
      usersWhoVoted.push(userId);

      songSubmission.save();
      return res.status(200).json({ message: "Up vote successfully added!" });
    } catch (error) {
      return res.sendStatus(400);
    }
  };
  addComment = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const { comment, username } = req.body;
      const songSubmission = await SongVersions.findByIdAndUpdate(postId);

      songSubmission.comments.push({ comment, username });

      songSubmission.save();

      return res.status(200).json({ message: "Comment successfully added" });
    } catch (error) {
      return res.sendStatus(400);
    }
  };

  getComments = async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
      const songSubmission = await SongVersions.findById(postId);
      const comments = songSubmission.comments;

      return res.status(200).json({ data: comments });
    } catch (error) {
      return res.sendStatus(400);
    }
  };

  getSubmissionsOfOneSong = async (req: Request, res: Response) => {
    const { slug } = req.params;

    try {
      const allSongs = await SongVersions.find({ slug });
      return res.status(200).json({ data: allSongs });
    } catch (error) {
      return res.sendStatus(400);
    }
  };
  getSubmissionsFromUser = async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
      const allSongs = await SongVersions.find({ userWhoPosted: username });
      return res.status(200).json({ data: allSongs });
    } catch (error) {
      return res.sendStatus(400);
    }
  };
}

export default new SongController();
