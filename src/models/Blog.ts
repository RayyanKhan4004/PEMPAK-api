import mongoose, { Schema, Document, Model } from 'mongoose';

export interface BlogDocument extends Document {
	image: string;
	title: string;
	description: string;
	pf: string;
	date: Date;
	images: string; // JSON.stringify of string[] URLs
}

const BlogSchema = new Schema<BlogDocument>({
	image: { type: String, required: true, trim: true },
	title: { type: String, required: true, trim: true },
	description: { type: String, required: true, trim: true },
	pf: { type: String, required: true, trim: true },
	date: { type: Date, default: () => new Date() },
	images: { type: String, required: true },
},{
	timestamps: true,
});

export const Blog: Model<BlogDocument> = mongoose.models.Blog || mongoose.model<BlogDocument>('Blog', BlogSchema);


