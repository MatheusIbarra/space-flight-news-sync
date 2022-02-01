import { Router } from 'express';
import ArticlesController from '../../controllers/articles/articles.controller';
const router = Router();

router.get('/', ArticlesController.listAll);
router.get('/:id', ArticlesController.listOne);
router.post('/', ArticlesController.post);
router.put('/:id', ArticlesController.put);
router.delete('/:id', ArticlesController.delete);
router.post('/sync/spacenewsapi/', ArticlesController.sync);
router.post('/sync/cronsync/', ArticlesController.cronSync);

export default router;