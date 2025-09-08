import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ProductDocument extends Document {
	heading: string;
	type: string;
	description: string;
	images: string; // JSON.stringify of string[] URLs
}

const ProductSchema = new Schema<ProductDocument>({
	heading: { type: String, required: true, trim: true },
	type: { type: String, required: true, trim: true },
	description: { type: String, required: true, trim: true },
	images: { type: String, required: true },
},{
	timestamps: true,
});

export const Product: Model<ProductDocument> = mongoose.models.Product || mongoose.model<ProductDocument>('Product', ProductSchema);


