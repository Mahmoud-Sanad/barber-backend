const authController = require("../controllers/authController");
const router=require("express").Router();
router.route('/login').post(authController.login);
router.route("/register").post(authController.register);
router.route("/verify").post(authController.verifyOTP);
router.route("/frogetPassword").post(authController.forgetPassword);
router.route("/resetPassword").post(authController.resetPassword);
router.use(authController.isLoggedIn);
module.exports=router;