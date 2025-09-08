import mongoose, { Schema, Document, Model } from 'mongoose';

export interface UserDocument extends Document {
	name: string;
	email: string;
	passwordHash: string;
}

const UserSchema = new Schema<UserDocument>({
	name: { type: String, required: true, trim: true },
	email: { type: String, required: true, unique: true, lowercase: true, trim: true },
	passwordHash: { type: String, required: true },
},{
	timestamps: true,
});

export const User: Model<UserDocument> = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);


