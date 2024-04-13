const authController = require("../controllers/authController");
const barberController = require("../controllers/barberController");
const router=require("express").Router();
router.use(authController.isLoggedIn);
router.route("/").post(authController.restrictTo("Barber"),barberController.createStore).get(barberController.getAllBarbers);
router.route('/services').get(barberController.getAllServices);

module.exports=router;