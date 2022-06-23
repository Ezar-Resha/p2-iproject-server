const router = require("express").Router();

const authentication = require("../middlewares/authentication");
const errorHandler = require("../middlewares/errorhandler");

router.use("", require("./user.js"));
router.use("/pets", require("./pet.js"));
router.use(authentication);
router.use("/match", require("./match.js"));

// get & post pet

router.use(errorHandler);

module.exports = router;
