import mongoose from "mongoose";

// Lottie file definition
export interface LottieFile {
  filename: string;
  contents: string;
}

// Mongoose item document
export interface ItemDocument extends mongoose.Document {
  id: string;
  description: string;
  author: string;
  tags: string[];
  dateUploaded: string;
  lottieFile: LottieFile;
}
