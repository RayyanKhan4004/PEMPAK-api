import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';

interface CloudinaryImage {
    url: string;
    public_id: string;
}

function validateCloudinaryImages(images: unknown): asserts images is CloudinaryImage[] {
    if (!Array.isArray(images) || images.length < 1) {
        throw new Error('images must be an array with at least 1 item');
    }
    if (!images.every((img) => 
        typeof img === 'object' && 
        img !== null &&
        typeof (img as CloudinaryImage).url === 'string' &&
        typeof (img as CloudinaryImage).public_id === 'string'
    )) {
        throw new Error('All images must have valid url and public_id properties');
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
		validateCloudinaryImages(images);
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
			validateCloudinaryImages(images);
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


