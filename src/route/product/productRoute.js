import express from "express";
import { productController } from "../../controller/product/productController.js";
import upload from "../../middleware/multerConfig.js";

const router = express.Router();

router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/", upload.array('images', 4), productController.create);
router.put("/:id", upload.array('images', 4), productController.update);
router.delete("/:id", productController.deleteById);

export { router as productRouter };