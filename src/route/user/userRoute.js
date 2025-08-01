import express from "express";
import { userController } from "../../controller/index.js";
const router = express.Router();
router.get("/", userController.getAll);
router.post("/", userController.create);

// Profile route - must be before /:id routes to avoid conflict
router.put("/profile", (req, res, next) => {
  console.log("PUT /profile route called");
  console.log("Request body:", req.body);
  console.log("Request headers:", req.headers);
  userController.updateProfile(req, res, next);
});

// ID-based routes
router.put("/:id", userController.update);
router.get("/:id", userController.getById);
router.delete("/:id", userController.delelteById);

// Cart routes
router.post("/:id/cart", userController.addToCart);
router.get("/:id/cart", userController.getCart);
router.put("/:id/cart/:productId", userController.updateCartQuantity);
router.delete("/:id/cart/:productId", userController.removeFromCart);

export { router as userRouter };