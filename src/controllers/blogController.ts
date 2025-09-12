import { Request, Response, NextFunction } from 'express';
import { Blog } from '../models/Blog';

function validateBase64Image(image: unknown): asserts image is string {
    if (typeof image !== 'string') {
        throw new Error('Image must be a base64 string');
    }
    if (!isBase64Image(image)) {
        throw new Error('Invalid base64 image format');
    }
}

function validateBase64Images(images: unknown): asserts images is string[] {
    if (!Array.isArray(images)) {
        throw new Error('images must be an array');
    }
    if (images.length > 5) {
        throw new Error('images must contain at most 5 items');
    }
    images.forEach((img, index) => {
        if (!isBase64Image(img)) {
            throw new Error(`Invalid base64 image format at index ${index}`);
        }
    });
}

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

function toResponse(blog: any) {
    return blog.toObject ? blog.toObject() : blog;
}

export async function createBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { image, title, description, pf, date, images } = req.body as { image?: string; title?: string; description?: string; pf?: string; date?: string | Date; images?: unknown };
		if (!image || !title || !description || !pf) {
			return void res.status(400).json({ message: 'image, title, description, pf are required' });
		}
		validateBase64Image(image);
		if (images) {
			validateBase64Images(images);
		}
		const payload: any = { image, title, description, pf, images: images || [] };
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
		if (image !== undefined) {
			validateBase64Image(image);
			update.image = image;
		}
		if (title !== undefined) update.title = title;
		if (description !== undefined) update.description = description;
		if (pf !== undefined) update.pf = pf;
		if (date !== undefined) update.date = new Date(date);
		if (images !== undefined) {
			validateBase64Images(images);
			update.images = images;
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


