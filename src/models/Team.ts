import mongoose, { Schema, Document, Model } from 'mongoose';

export interface TeamDocument extends Document {
	pf: string;
	name: string;
	role: string;
	image?: string;
}

const TeamSchema = new Schema<TeamDocument>({
	pf: { type: String, required: true, trim: true },
	name: { type: String, required: true, trim: true },
	role: { type: String, required: true, trim: true },
	image: { type: String, required: false }
},{
	timestamps: true,
});

export const Team: Model<TeamDocument> = mongoose.models.Team || mongoose.model<TeamDocument>('Team', TeamSchema);


