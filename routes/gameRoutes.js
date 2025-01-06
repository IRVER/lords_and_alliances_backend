const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const { getGameState } = require("../controllers/gameController");
const { updateGameState } = require("../controllers/gameController");

const router = express.Router();

// Ruta para obtener el estado del juego
router.get("/state", verifyToken, getGameState);
router.put("/update", verifyToken, updateGameState);

module.exports = router;
