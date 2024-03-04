
const { Order, MonitoringPeralatan} = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const { format } = require('date-fns');
const PDFDocument = require("pdfkit-table");





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

  if (!existingOrder) {
    return res.status(404).json({ message: 'Nomor order tidak ditemukan' });
  }

  const peralatanList = await MonitoringPeralatan.findAll({
    where: {
      no_order,
      tanggal: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['tanggal', 'ASC']], // Opsional: Mengurutkan berdasarkan tanggal terbaru
  });

  
  const doc = new PDFDocument({ margin: 30, size: 'A4' });
  const outputPath = `uploads/peralatan-${no_order}-${tahun}${bulan}.pdf`;
  doc.pipe(fs.createWriteStream(outputPath));


  doc.image('assets/logos.png', { width: 50 });
  doc.moveDown();

// Tambahkan divider
doc.moveTo(10, 75)
   .lineTo(580, 75)
   .stroke();

   // Tambahkan header ke PDF
   doc.moveDown();

  // Tambahkan header ke PDF
  doc
  .text('MONITORING PERALATAN PEST CONTROL', { align: 'center' });
  doc.moveDown();
  doc
  .text(`Tanggal : ${formattedDate}`, { align: 'left', margins:{left:20} });
  // doc.moveDown();
  doc
  .text(`Periode : ${bulan} ${tahun}`, { align: 'left', margins:{left:20} });
  doc
  .text(`Berikut daftar peralatan di Project : ${no_order}`, { align: 'left', margins:{left:20} });
  doc.moveDown();

  // Tentukan opsi untuk tabel
  const options = {
    margins: { top: 50, left: 50, bottom: 30, right: 50 },
    hideHeader :true,
  };



    const peralatanNumbered = peralatanList.map((peralatan, index) => ({
      ...peralatan.toJSON(),
      no: index + 1,
    }));

    const table = {
      headers: [
        { label: "No", property: 'no', width: 30, renderer: null },
        { label: "Name", property: 'name', width: 150, renderer: null },
        { label: "Merk", property: 'merek', width: 150, renderer: null }, 
        { label: "Jumlah", property: 'jumlah', width: 50, renderer: null }, 
        { label: "Satuan", property: 'satuan', width: 50, renderer: null }, 
        { label: "Kondisi", property: 'kondisi', width: 80, renderer: null }, 
       
      ],    

      datas: peralatanNumbered
     
    };
  
    doc.table(table, {
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        doc.font("Helvetica").fontSize(10);
        indexColumn === 0 && doc.addBackground(rectRow, 'white', 0.15);
      },
    });

    doc.end();
    
 
res.status(201).json({ success: true, url: outputPath });

  } catch (error) {
    res.status(500).json({ message: 'Gagal mendapatkan data pdf peralatan' });
    console.log(error);

  }
  

}


exports.getAllPeralatanByMonth = async (req, res) => {
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

    const peralatanList = await MonitoringPeralatan.findAll({
      where: {
        no_order,
        tanggal: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['tanggal', 'ASC']], // Opsional: Mengurutkan berdasarkan tanggal terbaru
    });


    if (!peralatanList || peralatanList.length === 0) {
      return res.status(404).json({ message: 'Tidak ada data peralatan untuk kriteria ini' });
    }

    res.status(201).json({ success: true, data: peralatanList });
  } catch (error) {
    console.error('Gagal mendapatkan data peralatan:', error);
    res.status(500).json({ message: 'Gagal mendapatkan data peralatan' });
  }


};

exports.addPeralatan = async (req, res) => {
  try {
    const { name, merek, jumlah, satuan, kondisi, tanggal } = req.body;
    const { no_order } = req.params;

    // Cari nomor order yang sesuai
    const existingOrder = await Order.findOne({ where: { no_order } });

    if (!existingOrder) {
      return res.status(404).json({ message: 'Nomor order tidak ditemukan' });
    }

    // Periksa apakah data peralatan dengan nama yang sama sudah ada di dalam order
    const existingPeralatan = await MonitoringPeralatan.findOne({
      where: { no_order, name, tanggal },
    });

    if (existingPeralatan) {
      return res.status(409).json({ message: 'Data peralatan sudah ada' });
    }

    // Tambahkan data peralatan ke dalam tabel
    const newPeralatan = await MonitoringPeralatan.create({
      name,
      no_order,
      merek,
      jumlah,
      satuan,
      kondisi,
      tanggal,
    });

    res.status(201).json(newPeralatan);
  } catch (error) {
    console.error('Gagal menambahkan peralatan:', error);
    res.status(500).json({ message: 'Gagal menambahkan peralatan' });
  }
};

  exports.getPeralatanDate = async (req, res) => {
    try {
      const { no_order,tanggal } = req.params;
  
      // Cari semua data peralatan berdasarkan nomor order
      const peralatanList = await MonitoringPeralatan.findAll({ where: { no_order, tanggal } });
  
      if (!peralatanList || peralatanList.length === 0) {
        return res.status(404).json({ message: 'Tidak ada data peralatan untuk di tanggal ini' });
      }
  
      res.status(201).json({success: true, data: peralatanList});
    } catch (error) {
      console.error('Gagal mendapatkan data peralatan:', error);
      res.status(500).json({ message: 'Gagal mendapatkan data peralatan' });
    }
  };
  
  exports.getAllPeralatan = async (req, res) => {
    try {
      const { no_order } = req.params;
  
      // Cari semua data peralatan berdasarkan nomor order
      const peralatanList = await MonitoringPeralatan.findAll({ where: { no_order }, order : [['tanggal', 'DESC']] });
  
      if (!peralatanList || peralatanList.length === 0) {
        return res.status(404).json({ message: 'Tidak ada data peralatan untuk nomor order ini' });
      }
  
      res.status(201).json({success: true,data: peralatanList});
    } catch (error) {
      console.error('Gagal mendapatkan data peralatan:', error);
      res.status(500).json({ message: 'Gagal mendapatkan data peralatan' });
    }
  };
  