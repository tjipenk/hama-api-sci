const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.createUser = async (req, res) => {
  try {
    const { email, password, role, fullName } = req.body;

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email sudah terdaftar" });
    }

    const hashPassword = await bcrypt
      .hash(password, saltRounds)
      .then((hashPassword) => hashPassword);

    // Jika email belum terdaftar, maka buat pengguna baru
    const newUser = await User.create({
      email: email,
      password: hashPassword,
      role: role,
      fullName: fullName,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Gagal membuat pengguna:", error);
    res.status(500).json({ error: "Gagal membuat pengguna" });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari pengguna berdasarkan email
    const user = await User.findOne({ where: { email } });

    // Membandingkan password di db dengan inputan
    const compareResult = await bcrypt
      .compare(password, user.password)
      .then((result) => result);

    if (!user || compareResult == false) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    // Jika email dan password cocok, buat token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "secret_key",
      {
        expiresIn: "1y",
      }
    );

    // Kirim token sebagai respons
    res.json({ token, role: user.role, fullName: user.fullName });
  } catch (error) {
    res.status(500).json({ message: "Gagal login" });
  }
};
