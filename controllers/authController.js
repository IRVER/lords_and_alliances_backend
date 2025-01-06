const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Simulación de una base de datos temporal
const users = [];

// Registro
const pool = require("../config/db");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el usuario
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
      [name, email, hashedPassword]
    );

    // Insertar progreso inicial
    await pool.query(
      "INSERT INTO progress (user_id, gold, food, loyalty) VALUES ($1, 100, 50, 80)",
      [newUser.rows[0].id]
    );

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
};



// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, user: { id: user.rows[0].id, name: user.rows[0].name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
};


module.exports = { register, login };
