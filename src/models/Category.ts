import mongoose, { Schema, Document, Model } from 'mongoose';

export interface CategoryDocument extends Document {
  name: string;
  description: string;
  bannerImage: string; // Single banner image URL
  additionalImages: string[]; // Array of 4 additional image URLs
}

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    bannerImage: { type: String, required: true },
    additionalImages: [{ type: String, required: true }] // Array of strings for additional images
  },
  { timestamps: true }
);

export const Category: Model<CategoryDocument> = mongoose.models.Category || mongoose.model<CategoryDocument>('Category', CategorySchema);
