import {Router} from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { deposit, getMoneyReceiveTransactions, getMoneySendTransactions, getTransactions, transferAmount, verifyReceiver } from '../controllers/transaction.controllers.js';


const router = Router();

router.route('/transfer-Amount').post(verifyJWT,transferAmount)
router.route('/deposit').post(verifyJWT,deposit);

router.route('/verifyReceiver').get(verifyReceiver);

router.route('/getTransaction/:id').get(verifyJWT,getTransactions);
router.route('/moneySendTrancation').get(verifyJWT,getMoneySendTransactions);
router.route('/moneyReceiveTrancation').get(verifyJWT,getMoneyReceiveTransactions);

export default router;