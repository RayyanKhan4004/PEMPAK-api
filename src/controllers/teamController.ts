import { Request, Response, NextFunction } from 'express';
import { Team } from '../models/Team';

export async function createTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { pf, name, role, image } = req.body as { pf?: string; name?: string; role?: string; image?: string };
		if (!pf || !name || !role) {
			return void res.status(400).json({ message: 'pf, name and role are required' });
		}
		const doc = await Team.create({ pf, name, role, image });
		return void res.status(201).json(doc);
	} catch (error) {
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
		if (image !== undefined) update.image = image;

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


