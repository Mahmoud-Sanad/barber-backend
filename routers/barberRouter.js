const authController = require("../controllers/authController");
const barberController = require("../controllers/barberController");
const router=require("express").Router();
router.use(authController.isLoggedIn);
router.route("/me").get(authController.restrictTo("Barber"),barberController.getMyStores);
router.route("/me/:id").get(authController.restrictTo("Barber"),barberController.getStoreById);
router.route("/").post(authController.restrictTo("Barber"),barberController.createServices,barberController.createStore).get(barberController.getAllBarbers);
router.route('/services').get(barberController.getAllServices);
router.route('/bookings/status/:id').post(barberController.changeBookingStatus);
router.route('/bookings/active/:id').get(barberController.getActiveStoreBookings);
router.route('/bookings/:id').get(barberController.getStoreBookings);


module.exports=router;