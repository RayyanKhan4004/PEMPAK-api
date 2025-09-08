import { Request, Response, NextFunction } from 'express';
import { Blog } from '../models/Blog';

function validateImagesMaxFive(images: unknown): asserts images is string[] {
	if (!Array.isArray(images)) {
		throw new Error('images must be an array');
	}
	if (images.length > 5) {
		throw new Error('images must contain at most 5 items');
	}
	if (!images.every((u) => typeof u === 'string')) {
		throw new Error('images array must contain only strings');
	}
}

function toResponse(blog: any) {
	const obj = blog.toObject ? blog.toObject() : blog;
	return {
		...obj,
		images: (() => {
			try { return JSON.parse(obj.images || '[]'); } catch { return []; }
		})(),
	};
}

export async function createBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { image, title, description, pf, date, images } = req.body as { image?: string; title?: string; description?: string; pf?: string; date?: string | Date; images?: unknown };
		if (!image || !title || !description || !pf) {
			return void res.status(400).json({ message: 'image, title, description, pf are required' });
		}
		validateImagesMaxFive(images ?? []);
		const payload: any = { image, title, description, pf, images: JSON.stringify(images ?? []) };
		if (date) payload.date = new Date(date);
		const doc = await Blog.create(payload);
		return void res.status(201).json(toResponse(doc));
	} catch (error) {
		return void next(error);
	}
}

export async function getBlogs(_req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const docs = await Blog.find().sort({ createdAt: -1 });
		return void res.status(200).json(docs.map(toResponse));
	} catch (error) {
		return void next(error);
	}
}

export async function getBlogById(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { id } = req.params;
		const doc = await Blog.findById(id);
		if (!doc) return void res.status(404).json({ message: 'Blog not found' });
		return void res.status(200).json(toResponse(doc));
	} catch (error) {
		return void next(error);
	}
}

export async function updateBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { id } = req.params;
		const { image, title, description, pf, date, images } = req.body as { image?: string; title?: string; description?: string; pf?: string; date?: string | Date; images?: unknown };

		const update: any = {};
		if (image !== undefined) update.image = image;
		if (title !== undefined) update.title = title;
		if (description !== undefined) update.description = description;
		if (pf !== undefined) update.pf = pf;
		if (date !== undefined) update.date = new Date(date);
		if (images !== undefined) {
			validateImagesMaxFive(images);
			update.images = JSON.stringify(images);
		}

		const doc = await Blog.findByIdAndUpdate(id, update, { new: true });
		if (!doc) return void res.status(404).json({ message: 'Blog not found' });
		return void res.status(200).json(toResponse(doc));
	} catch (error) {
		return void next(error);
	}
}

export async function deleteBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { id } = req.params;
		const doc = await Blog.findByIdAndDelete(id);
		if (!doc) return void res.status(404).json({ message: 'Blog not found' });
		return void res.status(204).send();
	} catch (error) {
		return void next(error);
	}
}


