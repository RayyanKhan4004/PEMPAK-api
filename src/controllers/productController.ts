import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';

function validateBase64Images(images: unknown): asserts images is string[] {
    if (!Array.isArray(images) || images.length < 1) {
        throw new Error('images must be an array with at least 1 item');
    }
    if (!images.every((img) => typeof img === 'string' && isBase64Image(img))) {
        throw new Error('All images must be valid base64 encoded strings');
    }
}

function isBase64Image(str: string): boolean {
    // Check if string is a valid base64 image format
    const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,/;
    if (!base64Regex.test(str)) {
        return false;
    }
    try {
        // Check if the rest is valid base64
        const base64Data = str.split(',')[1];
        return btoa(atob(base64Data)) === base64Data;
    } catch (e) {
        return false;
    }
}

function toResponse(product: any) {
    return product.toObject ? product.toObject() : product;
}

export async function createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { heading, type, description, images } = req.body as { heading?: string; type?: string; description?: string; images?: unknown };
		if (!heading || !type || !description) {
			return void res.status(400).json({ message: 'heading, type, and description are required' });
		}
		validateBase64Images(images);
		const doc = await Product.create({ heading, type, description, images });
		return void res.status(201).json(toResponse(doc));
	} catch (error) {
		return void next(error);
	}
}

export async function getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            Product.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments()
        ]);

        return void res.status(200).json({
            data: docs.map(toResponse),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return void next(error);
    }
}

export async function getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { id } = req.params;
		const doc = await Product.findById(id);
		if (!doc) return void res.status(404).json({ message: 'Product not found' });
		return void res.status(200).json(toResponse(doc));
	} catch (error) {
		return void next(error);
	}
}

export async function updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { id } = req.params;
		const { heading, type, description, images } = req.body as { heading?: string; type?: string; description?: string; images?: unknown };

		const update: any = {};
		if (heading !== undefined) update.heading = heading;
		if (type !== undefined) update.type = type;
		if (description !== undefined) update.description = description;
		if (images !== undefined) {
			validateBase64Images(images);
			update.images = images;
		}

		const doc = await Product.findByIdAndUpdate(id, update, { new: true });
		if (!doc) return void res.status(404).json({ message: 'Product not found' });
		return void res.status(200).json(toResponse(doc));
	} catch (error) {
		return void next(error);
	}
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { id } = req.params;
		const doc = await Product.findByIdAndDelete(id);
		if (!doc) return void res.status(404).json({ message: 'Product not found' });
		return void res.status(204).send();
	} catch (error) {
		return void next(error);
	}
}


