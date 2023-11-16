//src/routes/authRoutes.ts
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Sökväg till din User-modell

const router = express.Router();

// POST: /login - Hanterar användarautentisering
router.post("/login", async (req, res) => {
  try {
    // Extrahera användarnamn och lösenord från förfrågan
    const { username, password } = req.body;

    // Hitta användaren baserat på användarnamnet
    const user = await User.findOne({ username });

    // Kontrollera om användaren finns och om lösenordet matchar
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      // Användaren hittades och lösenordet matchar

      // Skapa en JWT-token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET, // Hemligheten som används för att signera token
        { expiresIn: "24h" } // Tokenens giltighetstid
      );

      // Skicka token som respons
      res.json({ message: "Inloggning lyckad", token });
    } else {
      // Användaren hittades inte eller lösenordet matchar inte
      res.status(401).json({ message: "Fel användarnamn eller lösenord" });
    }
  } catch (error) {
    // Ett serverfel inträffade
    res.status(500).json({ message: "Serverfel vid inloggning" });
  }
});

export default router;
