const authController = require("../controllers/authController");
const barberController = require("../controllers/barberController");
const router=require("express").Router();
router.use(authController.isLoggedIn);
router.route("/").post(authController.restrictTo("Barber"),barberController.createServices,barberController.createStore).get(barberController.getAllBarbers);
router.route('/services').get(barberController.getAllServices);
router.route('/bookings/status/:id').post(barberController.changeBookingStatus);
router.route('/bookings/:id').get(barberController.getStoreBookings);

module.exports=router;