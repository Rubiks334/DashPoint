import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ error: "Token requerido" });
    }

    // Formato esperado: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token inválido" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos datos del usuario en la request
    req.user = decoded; 
    // { id_usuario, rol }

    next();

  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};