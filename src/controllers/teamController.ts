import { Request, Response, NextFunction } from 'express';
import { Team } from '../models/Team';

function isBase64Image(str: string): boolean {
	const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,/;
	if (!base64Regex.test(str)) {
		return false;
	}
	try {
		const base64Data = str.split(',')[1];
		return btoa(atob(base64Data)) === base64Data;
	} catch (e) {
		return false;
	}
}

function validateBase64Image(image: unknown): asserts image is string {
	if (typeof image !== 'string') {
		throw new Error('Image must be a base64 string');
	}
	if (!isBase64Image(image)) {
		throw new Error('Invalid base64 image format');
	}
}

export async function createTeam(req: Request, res: Response, next: NextFunction): Promise<void> {

	const { pf, name, role, image } = req.body as { pf?: string; name?: string; role?: string; image?: string };
	if (!pf || !name || !role) {
		return void res.status(400).json({ message: 'pf, name and role are required' });
	}
	
	try {

		// Check if req.body exists
		if (!req.body) {
			return void res.status(400).json({
				message: 'Request body is missing',
				debug: {
					contentType: req.headers['content-type'],
					bodyType: typeof req.body
				}
			});
		}

		// Log the incoming request body for debugging
		console.log('Incoming request body:', req.body);

		const { pf, name, role, image } = req.body as { pf?: string; name?: string; role?: string, image?: string };

		// Validate required fields individually
		const missingFields = [];
		if (!pf) missingFields.push('pf');
		if (!name) missingFields.push('name');
		if (!role) missingFields.push('role');

		if (missingFields.length > 0) {
			return void res.status(400).json({
				message: `Missing required fields: ${missingFields.join(', ')}`,
				required: ['pf', 'name', 'role'],
				received: req.body
			});
		}

		if (image) {
			validateBase64Image(image);
		}

		const doc = await Team.create({ pf, name, role, image });
		return void res.status(201).json(doc);
	} catch (error) {
		console.error('Error in createTeam:', error);
		return void next(error);
	}
}

export async function getTeams(_req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const docs = await Team.find().sort({ createdAt: -1 });
		return void res.status(200).json(docs);
	} catch (error) {
		return void next(error);
	}
}

export async function getTeamById(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { id } = req.params;
		const doc = await Team.findById(id);
		if (!doc) return void res.status(404).json({ message: 'Team member not found' });
		return void res.status(200).json(doc);
	} catch (error) {
		return void next(error);
	}
}

export async function updateTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { id } = req.params;
		const { pf, name, role, image } = req.body as { pf?: string; name?: string; role?: string; image?: string };

		const update: any = {};
		if (pf !== undefined) update.pf = pf;
		if (name !== undefined) update.name = name;
		if (role !== undefined) update.role = role;
		if (image !== undefined) {
			if (image) {
				validateBase64Image(image);
			}
			update.image = image;
		}

		const doc = await Team.findByIdAndUpdate(id, update, { new: true });
		if (!doc) return void res.status(404).json({ message: 'Team member not found' });
		return void res.status(200).json(doc);
	} catch (error) {
		return void next(error);
	}
}

export async function deleteTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { id } = req.params;
		const doc = await Team.findByIdAndDelete(id);
		if (!doc) return void res.status(404).json({ message: 'Team member not found' });
		return void res.status(204).send();
	} catch (error) {
		return void next(error);
	}
}