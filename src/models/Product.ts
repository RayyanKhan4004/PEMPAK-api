import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ProductDocument extends Document {
	heading: string;
	type: string;
	description: string;
	images: string[]; // Array of base64 encoded image strings
}

const ProductSchema = new Schema<ProductDocument>({
	heading: { type: String, required: true, trim: true },
	type: { type: String, required: true, trim: true },
	description: { type: String, required: true, trim: true },
	images: [{ type: String, required: true }], // Store base64 strings directly as array
},{
	timestamps: true,
});

export const Product: Model<ProductDocument> = mongoose.models.Product || mongoose.model<ProductDocument>('Product', ProductSchema);


