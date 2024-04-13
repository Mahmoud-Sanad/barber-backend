const authController = require("../controllers/authController");
const packageController = require("../controllers/packagesController");
const router=require("express").Router();
router.use(authController.isLoggedIn);
router.route("/").post(authController.restrictTo("Admin"),packageController.createPackage).get(packageController.getAllPackages);
router.route("/buy").post(packageController.buyPackage);
module.exports = router;