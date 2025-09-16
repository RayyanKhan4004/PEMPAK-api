import mongoose, { Schema, Document, Model } from 'mongoose';

export interface BlogDocument extends Document {
	image: string; // base64 string for main image
	title: string;
	description: string;
	pf: string;
	date: Date;
	images: string[]; // Array of base64 strings for additional images
}

const BlogSchema = new Schema<BlogDocument>({
	image: { type: String, required: true }, // base64 image string
	title: { type: String, required: true, trim: true },
	description: { type: String, required: true, trim: true },
	pf: { type: String, required: true, trim: true },
	date: { type: Date, default: () => new Date() },
	images: [{ type: String, required: true }], // Array of base64 image strings
},{
	timestamps: true,
});

export const Blog: Model<BlogDocument> = mongoose.models.Blog || mongoose.model<BlogDocument>('Blog', BlogSchema);


