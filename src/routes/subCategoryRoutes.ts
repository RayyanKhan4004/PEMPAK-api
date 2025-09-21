import { Router } from 'express';
import { createSubCategory, getSubCategories, getSubCategoryById, updateSubCategory, deleteSubCategory } from '../controllers/subCategoryController';

const router = Router();

router.post('/', createSubCategory);
router.get('/', getSubCategories);
router.get('/:id', getSubCategoryById);
router.put('/:id', updateSubCategory);
router.delete('/:id', deleteSubCategory);

export default router;


