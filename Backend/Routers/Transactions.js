import express from 'express';
import { addTransaction, getTransaction, deleteTransaction, updateTransaction } from '../controllers/transactionController.js';

const router = express.Router();

router.route("/addTransaction").post(addTransaction);

router.route("/getTransaction").get(getTransaction);

router.route("/deleteTransaction/:id").delete(deleteTransaction);

router.route('/updateTransaction/:id').put(updateTransaction);

export default router;
