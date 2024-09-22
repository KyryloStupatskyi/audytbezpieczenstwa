const Router = require("express")
const router = new Router()

const authController = require("../controllers/authController")
const authValidator = require("../midlewares/authValidation")
const authMidleware = require("../midlewares/authMidleware")

router.post("/registration", authValidator.validateData(), authValidator.checkValidationResults, authController.registration)
router.post("/login", authValidator.validateData(), authValidator.checkValidationResults, authController.login)
router.get("/auth", authMidleware, authController.auth)

module.exports = router