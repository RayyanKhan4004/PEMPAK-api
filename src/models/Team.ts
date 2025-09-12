import mongoose, { Schema, Document, Model } from 'mongoose';

export interface TeamDocument extends Document {
	pf: string;
	name: string;
	role: string;
<<<<<<< HEAD
	image?: string; // base64 image string
=======
	image?: string;
>>>>>>> 4a356683359720fb9fe5af09399f689bdab775bd
}

const TeamSchema = new Schema<TeamDocument>({
	pf: { type: String, required: true, trim: true },
	name: { type: String, required: true, trim: true },
	role: { type: String, required: true, trim: true },
<<<<<<< HEAD
	image: { type: String, required: false } // base64 image string
},{
=======
	image: { type: String, required: false, trim: true },
}, {
>>>>>>> 4a356683359720fb9fe5af09399f689bdab775bd
	timestamps: true,
});

export const Team: Model<TeamDocument> = mongoose.models.Team || mongoose.model<TeamDocument>('Team', TeamSchema);


