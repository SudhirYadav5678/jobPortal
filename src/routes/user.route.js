import express from "express";
import { registeruser, userLogin, userlogout, updateProfile } from "../controller/user.controlller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js"


const router = express.Router();

router.route("/register").post(singleUpload, registeruser);
router.route("/login").post(userLogin);
router.route("/logout").get(userlogout);
router.route("/profile/update").post(isAuthenticated, updateProfile);

export default router;
