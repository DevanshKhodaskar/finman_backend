// routes/queries.js
import express from 'express';
const router = express.Router();
import {createQuery, listQueries, updateQuery, deleteQuery} from '../controller/queryController.js'

router.post('/', createQuery);
router.get('/', listQueries);
router.put('/:id', updateQuery);
router.delete('/:id', deleteQuery);

export default router;