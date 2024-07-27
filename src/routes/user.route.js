import express from "express";
import { registeruser, userLogin, userlogout, updateProfile } from "../controller/user.controlller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";


const router = express.Router();

router.route("/register").post(registeruser);
router.route("/login").post(userLogin);
router.route("/logout").get(userlogout);
router.route("/profile/update").post(isAuthenticated, updateProfile);

export default router;
