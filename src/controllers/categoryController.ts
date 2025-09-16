import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category';

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

function toResponse(category: any) {
    return category.toObject ? category.toObject() : category;
}

export async function createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { name, description, bannerImage, additionalImages } = req.body as { 
			name?: string; 
			description?: string; 
			bannerImage?: string; 
			additionalImages?: unknown 
		};
		
		if (!name || !description || !bannerImage) {
			return void res.status(400).json({ 
				message: 'name, description, and bannerImage are required' 
			});
		}
		
		const normalizedAdditionalImages = normalizeImagesArray(additionalImages) ?? [];
		
		// Validate that we have exactly 4 additional images
		if (normalizedAdditionalImages.length !== 1) {
			return void res.status(400).json({ 
				message: 'minimum 1 or maximum 4 additional images are required' 
			});
		}
		
		const doc = await Category.create({ 
			name,
			description, 
			bannerImage, 
			additionalImages: normalizedAdditionalImages 
		});
		
		return void res.status(201).json(toResponse(doc));
	} catch (error) {
		return void next(error);
	}
}

export async function getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            Category.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Category.countDocuments()
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

export async function getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { id } = req.params;
		const doc = await Category.findById(id);
		if (!doc) return void res.status(404).json({ message: 'Category not found' });
		return void res.status(200).json(toResponse(doc));
	} catch (error) {
		return void next(error);
	}
}

export async function updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { id } = req.params;
		const { name, description, bannerImage, additionalImages } = req.body as { 
			name?: string; 
			description?: string; 
			bannerImage?: string; 
			additionalImages?: unknown 
		};

		const update: any = {};
		if (name !== undefined) update.name = name;
		if (description !== undefined) update.description = description;
		if (bannerImage !== undefined) update.bannerImage = bannerImage;
		if (additionalImages !== undefined) {
			const normalized = normalizeImagesArray(additionalImages) ?? [];
			// Validate that we have exactly 4 additional images
			if (normalized.length !== 4) {
				return void res.status(400).json({ 
					message: 'exactly 4 additional images are required' 
				});
			}
			update.additionalImages = normalized;
		}

		const doc = await Category.findByIdAndUpdate(id, update, { new: true });
		if (!doc) return void res.status(404).json({ message: 'Category not found' });
		return void res.status(200).json(toResponse(doc));
	} catch (error) {
		return void next(error);
	}
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { id } = req.params;
		const doc = await Category.findByIdAndDelete(id);
		if (!doc) return void res.status(404).json({ message: 'Category not found' });
		return void res.status(204).send();
	} catch (error) {
		return void next(error);
	}
}
