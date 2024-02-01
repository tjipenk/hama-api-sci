
const { Order, DailyActivity} = require('../models');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');
const fs = require('fs');
const { format } = require('date-fns');
const pdf = require('html-pdf');
const handlebars = require('handlebars');





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



exports.getDownloadByMonth = async (req, res) => {

  try {
    const {no_order, bulan, tahun} = req.params;

  const startDate = new Date(`${tahun}-${bulan}-01`);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1) - 1);

  const currentDate = new Date();
  const formattedDate = format(currentDate, 'dd-MM-yyyy');

  // Cari nomor order yang sesuai
  const existingOrder = await Order.findOne({ where: { no_order } });
  const outputPath = `uploads/daily-${no_order}-${tahun}${bulan}.pdf`;

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



const templateContent = fs.readFileSync('dailytemplate.html', 'utf8');
const compiledTemplate = handlebars.compile(templateContent);
const htmlContent = compiledTemplate({
  no_order,
  formattedDate,
  bulan,
  tahun,
  dailyList: dailyList.map((daily, index) => ({
    no: index + 1,
    lokasi: daily.lokasi,
    jenis_treatment: daily.jenis_treatment,
    jenis_hama: daily.hama_ditemukan,
    jumlah: daily.jumlah,
    gambar: daily.bukti_foto,
    keterangan: daily.keterangan,
  })),
});


// Opsi konversi PDF
const options = {
  format: 'A4',
  orientation: 'landscape',
  border: {
    top: '1cm',
    right: '1cm',
    bottom: '1cm',
    left: '1cm',
  },
  
};

// Konversi HTML ke PDF
pdf.create(htmlContent, options).toFile(outputPath, (err, res) => {
  if (err) return console.error(err);
  console.log('PDF created successfully:', res.filename);
});
    
res.status(201).json({ success: true, url: outputPath });

  } catch (error) {
    res.status(500).json({ message: 'Gagal mendapatkan data pdf peralatan' });
    console.log(error);

  }
  

}

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
          tanggal, 
          jenis_treatment
        },
      });

      if (existingDaily) {
        return res.status(409).json({ message: 'Data Daily dengan Jenis treatment dan order yang sama sudah ada' });
      
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
console.log(newDaily);
      res.status(201).json({ message: 'Berhasil menambahkan data Daily' });
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

  
  




