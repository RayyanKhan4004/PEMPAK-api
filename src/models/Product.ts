import mongoose, { Schema, Document, Model } from 'mongoose';

interface CloudinaryImage {
    url: string;
    public_id: string;
}

export interface ProductDocument extends Document {
    heading: string;
    type: string;
    description: string;
    images: CloudinaryImage[]; // Array of Cloudinary image information
}

const ProductSchema = new Schema<ProductDocument>({
    heading: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    images: [{
        url: { type: String, required: true },
        public_id: { type: String, required: true }
    }] // Store Cloudinary image URLs and public_ids
},{
	timestamps: true,
});

export const Product: Model<ProductDocument> = mongoose.models.Product || mongoose.model<ProductDocument>('Product', ProductSchema);


