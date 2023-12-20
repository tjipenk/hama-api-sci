const { Order, InspeksiAksesHama } = require("../models");
const { Op } = require('sequelize');


const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Simpan file di direktori "uploads/"
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Gunakan nama asli file
  },
});


const upload = multer({ storage });


uploadFile = upload.single('bukti_foto'); 


exports.getAllInspeksiByMonth = async (req, res) => {
  try {
   
    const {no_order, bulan, tahun} = req.params;

    const startDate = new Date(`${tahun}-${bulan}-01`);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1) - 1);

    // Cari nomor order yang sesuai
    const existingOrder = await Order.findOne({ where: { no_order } });

    if (!existingOrder) {
      return res.status(404).json({ message: 'Nomor order tidak ditemukan' });
    }

    const inspeksiList = await InspeksiAksesHama.findAll({
      where: {
        no_order,
        tanggal: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['tanggal', 'ASC']], // Opsional: Mengurutkan berdasarkan tanggal terbaru
    });


    if (!inspeksiList || inspeksiList.length === 0) {
      return res.status(404).json({ message: 'Tidak ada data inspeksi untuk kriteria ini' });
    }
    res.status(201).json({ success: true, data: inspeksiList });
  } catch (error) {
    console.error('Gagal mendapatkan data inspeksi:', error);
    res.status(500).json({ message: 'Gagal mendapatkan data inspeksi' });
  }
};

exports.addInspeksi = async (req, res) => {
  try {
    uploadFile(req, res, async (err) => {
      if (err) {
        console.error("Gagal mengunggah file:", err);
        return res.status(500).json({ message: "Gagal mengunggah file" });
      }
      const { no_order } = req.params;
      const {
        lokasi,
        rekomendasi,
        tanggal,    
        keterangan,
      } = req.body;

      const { filename } = req.file; // Nama file yang diunggah

      // Cari nomor order yang sesuai
      const existingOrder = await Order.findOne({ where: { no_order } });

      if (!existingOrder) {
        return res.status(404).json({ message: "Nomor order tidak ditemukan" });
      }
      const existingDaily = await InspeksiAksesHama.findOne({
        where: {       
          no_order,        
          tanggal
      
        },
      });

      if (existingDaily) {
        return res.status(409).json({ message: 'Data Inspeksi dengan nama dan order yang sama sudah ada' });
      
      }

      // Tambahkan data Daily ke dalam tabel
      const newInspeksi = await InspeksiAksesHama.create({
      
        lokasi,
        rekomendasi,
        tanggal,
        bukti_foto: filename,
        keterangan,
        no_order,
      });

      res.status(201).json(newInspeksi);
    });
  } catch (error) {
    console.error("Gagal menambahkan Inspeksi:", error);
    res.status(500).json({ message: "Gagal menambahkan Inspeksi" });
  }
 
};

exports.getAllInspeksi = async (req, res) => {
  try {
    const { no_order } = req.params;

    // Cari semua data Inspeksi berdasarkan nomor order
    const inspeksiList = await InspeksiAksesHama.findAll({
      where: { no_order },
    });

    if (!inspeksiList || inspeksiList.length === 0) {
      return res
        .status(404)
        .json({ message: "Tidak ada data Inspeksi untuk nomor order ini" });
    }

    res.status(201).json({ success: true, data: inspeksiList });
  } catch (error) {
    console.error("Gagal mendapatkan data Inspeksi:", error);
    res.status(500).json({ message: "Gagal mendapatkan data Inspeksi" });
  }
};


  
exports.getAllInspeksiDate = async (req, res) => {
  try {
    const { no_order,tanggal } = req.params;

    // Cari semua data inspeksi berdasarkan nomor order
    const inspeksiList = await InspeksiAksesHama.findAll({ where: { no_order,tanggal } });

    if (!inspeksiList || inspeksiList.length === 0) {
      return res.status(404).json({ message: 'Tidak ada data Inspeksi untuk nomor order ini' });
    }

    res.status(201).json({success: true, data: inspeksiList});
  } catch (error) {
    console.error('Gagal mendapatkan data Inspeksi:', error);
    res.status(500).json({ message: 'Gagal mendapatkan data Inspeksi' });
  }
};

