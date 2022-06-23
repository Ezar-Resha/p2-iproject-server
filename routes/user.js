const router = require("express").Router();
const UserController = require("../controllers/usercontroller");
const authentication = require("../middlewares/authentication");

router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.post("/verifyOTP", authentication, UserController.verifyUser); // must be logged in
router.post("/requestOTP", UserController.requestOTP);
router.get("/user/:id", UserController.getUserDetail);
module.exports = router;
