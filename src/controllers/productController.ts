import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';

function ensureImagesArrayAtLeast1(images: unknown): asserts images is string[] {
	if (!Array.isArray(images) || images.length < 1) {
		throw new Error('images must be an array with at least 1 items');
	}
	if (!images.every((u) => typeof u === 'string')) {
		throw new Error('images array must contain only strings');
	}
}

function toResponse(product: any) {
	const obj = product.toObject ? product.toObject() : product;
	return {
		...obj,
		images: (() => {
			try { return JSON.parse(obj.images || '[]'); } catch { return []; }
		})(),
	};
}

export async function createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { heading, type, description, images } = req.body as { heading?: string; type?: string; description?: string; images?: unknown };
		if (!heading || !type || !description) {
			return void res.status(400).json({ message: 'heading, type, and description are required' });
		}
		ensureImagesArrayAtLeast1(images);
		const doc = await Product.create({ heading, type, description, images: JSON.stringify(images) });
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
			ensureImagesArrayAtLeast1(images);
			update.images = JSON.stringify(images);
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


