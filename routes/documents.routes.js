const router = require("express").Router()
const documentsController = require("../controllers/documents.controller")
const multer = require("multer")
const upload = multer()

router.get("/page/:page", documentsController.readdocuments)
router.get("/:id", documentsController.getdocument)
router.post("/upload/:matiere", upload.single("file"), documentsController.uploaddocument)
router.post("/", documentsController.createdocument)
router.put("/:id", documentsController.updatedocument)
router.delete("/:id", documentsController.deletedocument)
// router.post("/:id", documentsController.downloaddocument)
router.get("/:id/:page", documentsController.getdocumentuser)

module.exports = router