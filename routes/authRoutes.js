const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// Ruta de registro
router.post("/register", register);

// Ruta de login
router.post("/login", login);

module.exports = router;
