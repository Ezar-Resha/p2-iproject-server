const router = require("express").Router();
const PetController = require("../controllers/petcontroller");
const authentication = require("../middlewares/authentication");

router.get("/", PetController.listAllPets);
router.get("/breed", PetController.getDogBreed);
router.get("/:id", PetController.getPetDetail);

router.use(authentication);
router.put("//:id", PetController.UpdatePetDetails); // has to be owner
router.post("/", PetController.addPet);
module.exports = router;
