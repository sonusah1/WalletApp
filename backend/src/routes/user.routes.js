import {Router} from 'express';
import {upload} from "../middlewares/multer.middlewares.js"
import { currentUser, getAllUser, getImage, login, logOut, register, updateAvatar, updateVerify } from '../controllers/user.contollers.js';
import { admin, verifyJWT } from '../middlewares/auth.middlewares.js';


const router = Router();

router.route("/register").post(upload.single("avatar"),register)

router.route('/login').post(login)
router.route("/logout").post(verifyJWT,logOut)
router.route('/current_user').get(verifyJWT,currentUser)
router.route('/get_users').get(verifyJWT,getAllUser)
router.route('/verify/:id').put(verifyJWT,admin,updateVerify)

router.route('/get_image').get(verifyJWT,getImage)

router.route('/avatar').post(verifyJWT,upload.single("avatar"),updateAvatar)


export default router;