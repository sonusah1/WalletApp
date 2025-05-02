import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import { getAllRequest, getRequestReceivedTransaction, getRequestSendTransaction, requestAmount, updateRequestStats } from "../controllers/request.controllers.js";

const router = Router();

router.route('/request-amount').post(verifyJWT,requestAmount)
router.route('/get-request').post(verifyJWT,getAllRequest)
router.route('/request-send').get(verifyJWT,getRequestSendTransaction)
router.route('/request-received').get(verifyJWT,getRequestReceivedTransaction)

router.route('/update-request-status').post(verifyJWT,updateRequestStats)

export default router;