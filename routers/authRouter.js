const authController = require("../controllers/authController");
const router=require("express").Router();
router.route('/login').post(authController.login);
router.route("/register").post(authController.register);
router.route("/verify").post(authController.verifyOTP);
router.route("/forgetPassword").post(authController.forgetPassword);
router.route("/resetPassword").post(authController.resetPassword);
router.use(authController.isLoggedIn);
router.route("/me").get(authController.getMe);
router.route("/changePassword").post(authController.changePassword);

module.exports=router;