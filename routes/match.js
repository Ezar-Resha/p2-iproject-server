const router = require("express").Router();
const MatchController = require("../controllers/matchcontroller");

router.get("/", MatchController.findYourMatches);
router.post("/:id", MatchController.createMatch);
module.exports = router;
