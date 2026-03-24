import { Router } from 'express';
import { expenseController } from '../controllers/expenseController';
import { protect } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/requestValidator';
import { createTransactionSchema, updateTransactionSchema, transactionQuerySchema } from '../utils/validators';

const router = Router();
router.use(protect);

router.post('/', validateRequest(createTransactionSchema), expenseController.create);
router.get('/', validateRequest(transactionQuerySchema, 'query'), expenseController.list);
router.get('/:id', expenseController.getById);
router.patch('/:id', validateRequest(updateTransactionSchema), expenseController.update);
router.delete('/:id', expenseController.delete);

export default router;
