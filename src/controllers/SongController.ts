import SongVersions from "../models/SongVersions";
import { Request, Response } from "express";

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
        throw new Error(
          `This version was already posted by - ${alreadyExists.userWhoPosted}`
        );
      }
      // TODO: I'm checking the session status on the front end so don't need to check and throw new error here
      if (!userWhoPosted) {
        throw new Error("Please login to submit a post");
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
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  updateVoteCount = async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      const { id } = req.params;
      const songSubmission = await SongVersions.findByIdAndUpdate(id);
      const usersWhoVoted = songSubmission.votedBy;

      if (!userId) {
        throw new Error("Please login to vote");
      }

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
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };
  addComment = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const { comment, username, userId } = req.body;
      const songSubmission = await SongVersions.findByIdAndUpdate(postId);

      songSubmission.comments.push({ comment, username, userId });

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

  getSubmissions = async (req: Request, res: Response) => {
    const { filter, value } = req.query;

    try {
      if (!filter && !value) {
        const allSubmissions = await SongVersions.find();
        return res.status(200).json({ data: allSubmissions });
        // TODO: lol this is kind of a confusing way to limit by the filter here should improve and make easier to understand in the future
      } else if (filter == "limit") {
        const lastTenSubmissions = await SongVersions.find()
          .sort({ createdAt: -1 })
          .limit(Number(value));
        return res.status(200).json({ data: lastTenSubmissions });
      } else {
        const filterField = filter as string;
        const filterSubmissions = await SongVersions.find({ [filterField]: value }).sort({
          voteCount: -1,
        });
        return res.status(200).json({ data: filterSubmissions });
      }
    } catch (error) {
      console.log(error, "error caught");
      return res.sendStatus(400);
    }
  };
}

export default new SongController();
