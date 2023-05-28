const router = require("express").Router()
const authController = require("../controllers/auth.controller")
const userController = require("../controllers/user.controller")
const uploadController = require("../controllers/upload.controller")
const piecesController = require("../controllers/pieces.controller")


const multer = require("multer")
const upload = multer()

//auth
router.post("/register", authController.signUp)
router.post("/login", authController.signIn)
router.get("/logout", authController.logout)

//user display
router.get("/", userController.getAllUsers)
router.get("/:id", userController.userInfo)
router.put("/:id", userController.updateUser)
router.delete("/:id", userController.deleteUser)

//verification d'email
router.get("/:id/verify/:token", authController.verifyToken)

//upload
router.post("/upload", upload.single("file"), uploadController.uploadProfil)

//MUNpieces
router.post("/pieces/add", piecesController.addpieces)
router.post('/pieces/substract', piecesController.enleverpieces)

module.exports = router