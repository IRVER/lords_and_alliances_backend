require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
