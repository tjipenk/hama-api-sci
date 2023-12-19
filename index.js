// app.js atau index.js (file utama aplikasi Anda)

const express = require("express");
const app = express();
const routes = require("./routes");

app.use(express.json());

// Gunakan rute yang telah Anda buat
app.use("/api", routes);

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
