const pool = require("../config/db");

const getGameState = async (req, res) => {
  console.error("Solicitud recibida en /state, usuario autenticado:", req.user);

  try {
    const userId = req.user.id;

    // Consulta para obtener progreso del usuario
    const progress = await pool.query("SELECT * FROM progress WHERE user_id = $1", [userId]);

    if (progress.rows.length === 0) {
      console.log("Progreso no encontrado para el usuario:", userId);
      return res.status(404).json({ message: "Progreso no encontrado" });
    }

    console.error("Progreso encontrado:", progress.rows[0]);
    res.status(200).json(progress.rows[0]);
  } catch (err) {
    console.error("Error en el servidor al procesar /state:", err.message);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const updateGameState = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gold, food, loyalty, game_started } = req.body;

    // Actualizar el row completo de progress
    const result = await pool.query(
      `UPDATE progress 
       SET gold = $1, food = $2, loyalty = $3, game_started = $4
       WHERE user_id = $5 
       RETURNING *`,
      [gold, food, loyalty, game_started, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Progreso no encontrado" });
    }

    res.status(200).json({ message: "Estado del juego actualizado", gameData: result.rows[0] });
  } catch (err) {
    console.error("Error al actualizar el estado del juego:", err.message);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = { getGameState, updateGameState };
