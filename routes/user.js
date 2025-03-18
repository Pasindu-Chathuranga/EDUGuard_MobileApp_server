const express = require("express");
const router = express.Router();
const UserController = require("../controller/user");

// Routes for managing users
router.post("/add", UserController.addUser);
router.get("/get", UserController.getUsers);
router.put("/update/:id", UserController.updateUser);
router.delete("/delete/:id", UserController.deleteUser);

// Authentication Route
router.post("/login", UserController.loginUser);

module.exports = router;
