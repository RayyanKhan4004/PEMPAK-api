import { Request, Response, NextFunction } from 'express';
import { Blog } from '../models/Blog';

// Normalize incoming image fields from admin (string URL(s))
function normalizeImageInput(input: unknown): string | undefined {
    if (typeof input === 'string') {
        const v = input.trim();
        return v.length > 0 ? v : undefined;
    }
    return undefined;
}

function normalizeImagesArray(input: unknown): string[] | undefined {
    if (input === undefined || input === null) return undefined;
    if (Array.isArray(input)) {
        return input
            .map((v) => (typeof v === 'string' ? v.trim() : ''))
            .filter((v) => v.length > 0);
    }
    if (typeof input === 'string') {
        const v = input.trim();
        return v ? [v] : [];
    }
    return undefined;
}

function toResponse(blog: any) {
    return blog.toObject ? blog.toObject() : blog;
}

export async function createBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { image, title, description, pf, date, images } = req.body as { image?: unknown; title?: string; description?: string; pf?: string; date?: string | Date; images?: unknown };
		const normalizedImage = normalizeImageInput(image);
		const normalizedImages = normalizeImagesArray(images) ?? [];
		if (!normalizedImage || !title || !description || !pf) {
			return void res.status(400).json({ message: 'image, title, description, pf are required' });
		}
		const payload: any = { image: normalizedImage, title, description, pf, images: normalizedImages };
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
		const { image, title, description, pf, date, images } = req.body as { image?: unknown; title?: string; description?: string; pf?: string; date?: string | Date; images?: unknown };

		const update: any = {};
		if (image !== undefined) {
			const normalized = normalizeImageInput(image);
			if (normalized !== undefined) update.image = normalized;
		}
		if (title !== undefined) update.title = title;
		if (description !== undefined) update.description = description;
		if (pf !== undefined) update.pf = pf;
		if (date !== undefined) update.date = new Date(date);
		if (images !== undefined) {
			const normalized = normalizeImagesArray(images) ?? [];
			update.images = normalized;
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


