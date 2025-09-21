import { Request, Response, NextFunction } from 'express';
import { SubCategory, SubCategoryDocument } from '../models/SubCategory';

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

function toResponse(doc: any) {
    return doc?.toObject ? doc.toObject() : doc;
}

export async function createSubCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { name, bannerimg, description, images, parentCategory } = req.body as Partial<SubCategoryDocument> & { images?: unknown };

        if (!name || !parentCategory) {
            return void res.status(400).json({ message: 'name and parentCategory are required' });
        }

        const normalizedImages = normalizeImagesArray(images) ?? [];

        const doc = await SubCategory.create({
            name,
            bannerimg,
            description,
            images: normalizedImages,
            parentCategory
        });

        return void res.status(201).json(toResponse(doc));
    } catch (error) {
        return void next(error);
    }
}

export async function getSubCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            SubCategory.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            SubCategory.countDocuments()
        ]);

        return void res.status(200).json({
            data: docs.map(toResponse),
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        return void next(error);
    }
}

export async function getSubCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        const doc = await SubCategory.findById(id);
        if (!doc) return void res.status(404).json({ message: 'SubCategory not found' });
        return void res.status(200).json(toResponse(doc));
    } catch (error) {
        return void next(error);
    }
}

export async function updateSubCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        const { name, bannerimg, description, images, parentCategory } = req.body as Partial<SubCategoryDocument> & { images?: unknown };

        const update: any = {};
        if (name !== undefined) update.name = name;
        if (bannerimg !== undefined) update.bannerimg = bannerimg;
        if (description !== undefined) update.description = description;
        if (parentCategory !== undefined) update.parentCategory = parentCategory;
        if (images !== undefined) {
            const normalized = normalizeImagesArray(images) ?? [];
            update.images = normalized;
        }

        const doc = await SubCategory.findByIdAndUpdate(id, update, { new: true });
        if (!doc) return void res.status(404).json({ message: 'SubCategory not found' });
        return void res.status(200).json(toResponse(doc));
    } catch (error) {
        return void next(error);
    }
}

export async function deleteSubCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        const doc = await SubCategory.findByIdAndDelete(id);
        if (!doc) return void res.status(404).json({ message: 'SubCategory not found' });
        return void res.status(204).send();
    } catch (error) {
        return void next(error);
    }
}


