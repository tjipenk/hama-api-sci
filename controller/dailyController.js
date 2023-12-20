
const { Order, DailyActivity} = require('../models');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');




// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Simpan file di direktori "uploads/"
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Gunakan nama asli file
  },
  limits: {
    fileSize: 5000000, // Batas ukuran file dalam byte (contoh: 5 MB)
  },
});



const upload = multer({ storage });


uploadFile = upload.single('bukti_foto'); 

exports.getAllDailyByMonth = async (req, res) => {
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

    const dailyList = await DailyActivity.findAll({
      where: {
        no_order,
        tanggal: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['tanggal', 'ASC']], // Opsional: Mengurutkan berdasarkan tanggal terbaru
    });


    if (!dailyList || dailyList.length === 0) {
      return res.status(404).json({ message: 'Tidak ada data Daily untuk kriteria ini' });
    }

    res.status(201).json({ success: true, data: dailyList });
  } catch (error) {
    console.error('Gagal mendapatkan data daily:', error);
    res.status(500).json({ message: 'Gagal mendapatkan data daily' });
  }

};

exports.addDaily = async (req, res) => {
  try {
    uploadFile(req, res, async (err) => {
      if (err) {
        console.error('Gagal mengunggah file:', err);
        return res.status(500).json({ message: 'Gagal mengunggah file' });
      }
      const { no_order } = req.params;
      const {     
        lokasi,
        jenis_treatment,
        hama_ditemukan,
        jumlah,
        tanggal,
        keterangan,
      } = req.body;

      const { filename } = req.file; 
      const existingOrder = await Order.findOne({ where: { no_order } });

      if (!existingOrder) {
        return res.status(404).json({ message: 'Nomor order tidak ditemukan' });
      }

      // Cek apakah data dengan nomor order dan tanggal yang sama sudah ada
      const existingDaily = await DailyActivity.findOne({
        where: {
       
          no_order,
          tanggal
      
        },
      });

      if (existingDaily) {
        return res.status(409).json({ message: 'Data Daily dengan nama dan order yang sama sudah ada' });
      
      }

      // Tambahkan data Daily ke dalam tabel
      const newDaily = await DailyActivity.create({
        lokasi,
        jenis_treatment,
        hama_ditemukan,
        jumlah,
        tanggal,
        bukti_foto: filename, // Simpan nama file dalam tabel     
        keterangan,
        no_order,
      });

      res.status(201).json(newDaily);
    });
  } catch (error) {
    console.error('Gagal menambahkan Daily:', error);
    res.status(500).json({ message: 'Gagal menambahkan Daily' });
  }
};

  
  exports.getAllDaily = async (req, res) => {
    try {
      const { no_order } = req.params;
  
      // Cari semua data Daily berdasarkan nomor order
      const DailyList = await DailyActivity.findAll({ where: { no_order } });
  
      if (!DailyList || DailyList.length === 0) {
        return res.status(404).json({ message: 'Tidak ada data Daily untuk nomor order ini' });
      }
  
      res.status(201).json({success: true, data: DailyList});
    } catch (error) {
      console.error('Gagal mendapatkan data Daily:', error);
      res.status(500).json({ message: 'Gagal mendapatkan data Daily' });
    }
  };
  
  exports.getAllDailyDate = async (req, res) => {
    try {
      const { no_order,tanggal } = req.params;
  
      // Cari semua data Daily berdasarkan nomor order
      const DailyList = await DailyActivity.findAll({ where: { no_order,tanggal } });
  
      if (!DailyList || DailyList.length === 0) {
        return res.status(404).json({ message: 'Tidak ada data Daily untuk nomor order ini' });
      }
  
      res.status(201).json({success: true, data: DailyList});
    } catch (error) {
      console.error('Gagal mendapatkan data Daily:', error);
      res.status(500).json({ message: 'Gagal mendapatkan data Daily' });
    }
  };

  
  




