const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const router=require("express").Router();
router.use(authController.isLoggedIn);
router.route("/booking").get(userController.getMyBooking);
router.route("/booking/:id").get(userController.getBookingById).post(userController.book);
router.route("/favorite").get(userController.getFavorite);
router.route("/favorite/:id").get(userController.addFavorite);
module.exports=router;