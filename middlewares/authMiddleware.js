const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.error("Header Authorization recibido:", authHeader);

  if (!authHeader) {
    console.error("No se proporcionó el token");
    return res.status(403).json({ message: "No se proporcionó el token" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.error("Token ausente en el encabezado");
    return res.status(403).json({ message: "Token no válido" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.error("Token verificado, payload:", verified);
    req.user = verified; // Adjuntar el usuario verificado al objeto req
    next();
  } catch (err) {
    console.error("Error al verificar el token:", err.message);
    res.status(403).json({ message: "Token inválido o expirado" });
  }
};

module.exports = { verifyToken };
