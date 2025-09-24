import mongoose, { Schema, Document, Model } from 'mongoose';

export type ParentCategory =
  | 'Switchgear / Controlgear'
  | 'Power Distribution Transformer'
  | 'Green Energy'
  | 'Appliances';

export interface SubCategoryDocument extends Document {
  name: string;
  description?: string;
  bannerimg?: string;
  images: string[];
  parentCategory: ParentCategory;
}

const SubCategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    bannerimg: { type: String },
    images: [{ type: String }],
    parentCategory: {
      type: String,
      required: true,
      enum: [
        'Switchgear / Controlgear',
        'Power Distribution Transformer',
        'Green Energy',
        'Appliances'
      ]
    }
  },
  { timestamps: true }
);

export const SubCategory: Model<SubCategoryDocument> =
  mongoose.models.SubCategory ||
  mongoose.model<SubCategoryDocument>('SubCategory', SubCategorySchema);


