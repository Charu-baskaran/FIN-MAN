import express from 'express';
import { LoginUser, SignupUser } from '../controllers/userController.js';

const router = express.Router();

router.route("/Signup").post(SignupUser);
router.route("/Login").post(LoginUser);

export default router;
