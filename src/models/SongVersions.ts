import mongoose, { Schema, models } from "mongoose";

const songVersionSchema = new Schema(
  {
    songName: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    venueName: {
      type: String,
      required: true,
    },
    venueLocation: {
      type: String,
      required: true,
    },
    voteCount: {
      type: Number,
      default: 1,
    },
    votedBy: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    },
    comments: {
      type: [
        {
          comment: String,
          username: String,
          userId: String,
          profilePicture: String,
        },
      ],
    },
    userWhoPosted: {
      type: {
        username: String,
        userId: String,
      },
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// or statement below says if already have the model then return the song and if you don't have then it will create a new model
const SongVersions =
  models.SongVersions || mongoose.model("song_versions", songVersionSchema);

export default SongVersions;
