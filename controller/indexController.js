
const { Order, PerhitunganIndeks} = require('../models');
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

  const perhitunganIndexList = await PerhitunganIndeks.findAll({
    where: {
      no_order,
      tanggal: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['tanggal', 'ASC']], // Opsional: Mengurutkan berdasarkan tanggal terbaru
  });

 
  const doc = new PDFDocument({ margin: 30, size: 'A4' , layout : 'portrait'});
  const outputPath = `uploads/perhitungan-index-${no_order}-${tahun}${bulan}.pdf`;
  doc.pipe(fs.createWriteStream(outputPath));

  // Tambahkan header ke PDF
  doc
  .text('PERHITUNGAN INDEKS POPULASI HAMA', { align: 'center' });
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

    const perhitunganIndexNumbered = perhitunganIndexList.map((indeks, index) => ({
      ...indeks.toJSON(),
      no: index + 1,
    }));

    const table = {
      headers: [
        { label: "No", property: 'no', width: 30, renderer: null },
        { label: "Lokasi", property: 'lokasi', width: 80, renderer: null },
        { label: "Tanggal", property: 'tanggal', width: 100, renderer: null }, 
        { label: "Jenis Hama", property: 'jenis_hama', width: 150, renderer: null }, 
        { label: "Indeks Populasi", property: 'indeks_populasi', width: 50, renderer: null }, 
        { label: "Status", property: 'status', width: 80, renderer: null }, 
       
      ],    

      datas: perhitunganIndexNumbered
     
    };
  
    doc.table(table, {
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        doc.font("Helvetica").fontSize(10);
        indexColumn === 0 && doc.addBackground(rectRow, 'white', 0.15);
      },
    });

    doc
  .text('Keterangan :', { align: 'left', fontSize: 10 });
  doc.moveDown();
    doc
  .text('1. Data di atas diperoleh berdasarkan hasil inspeksi monitoring yang dilakukan.', { align: 'left', fontSize: 6 });
  // doc.moveDown();
    doc
  .text('2. Perhitungan Indeks Populasi dan penetapan status (terkendali / tidak terkendali) mengacu pada Standar Baku Mutu Kesehatan Lingkungan (Permenkes No.2 tahun 2023)', { align: 'left', fontSize: 6 });
  doc.moveDown();

    doc.end();
    
 
res.status(201).json({ success: true, url: outputPath });

  } catch (error) {
    res.status(500).json({ message: 'Gagal mendapatkan data pdf Perhitungan Indeks' });
    console.log(error);

  }
  

}


exports.getAllIndexByMonth = async (req, res) => {
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

    const indexList = await PerhitunganIndeks.findAll({
      where: {
        no_order,
        tanggal: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['tanggal', 'ASC']], // Opsional: Mengurutkan berdasarkan tanggal terbaru
    });


    if (!indexList || indexList.length === 0) {
      return res.status(404).json({ message: 'Tidak ada data indeks untuk kriteria ini' });
    }
    res.status(201).json({ success: true, data: indexList });
  } catch (error) {
    console.error('Gagal mendapatkan data indeks:', error);
    res.status(500).json({ message: 'Gagal mendapatkan data indeks' });
  }
};

exports.addIndeks = async (req, res) => {
    try {
      const {   lokasi, jenis_hama, indeks_populasi, jumlah,tanggal,status } = req.body;
      const { no_order } = req.params;
      // Cari nomor order yang sesuai
      const existingOrder = await Order.findOne({ where: { no_order } });
  
      if (!existingOrder) {
        return res.status(404).json({ message: 'Nomor order tidak ditemukan' });
      }
      // const existingPeralatan = await PerhitunganIndeks.findOne({
      //   where: { no_order },
      // });
  
      // if (existingPeralatan) {
      //   return res.status(409).json({ message: 'Data index sudah ada' });
      // }
  
      // Tambahkan data Indeks ke dalam tabel
      const newIndeks = await PerhitunganIndeks.create({ lokasi, jenis_hama, indeks_populasi, jumlah,tanggal,status,no_order });
  
      res.status(201).json(newIndeks);
    } catch (error) {
      console.error('Gagal menambahkan Indeks:', error);
      res.status(500).json({ message: 'Gagal menambahkan Indeks' });
    }
  };
  
  exports.getAllIndeks = async (req, res) => {
    try {
      const { no_order } = req.params;
  
      // Cari semua data Indeks berdasarkan nomor order
      const IndeksList = await PerhitunganIndeks.findAll({ where: { no_order } });
  
      if (!IndeksList || IndeksList.length === 0) {
        return res.status(404).json({ message: 'Tidak ada data Indeks untuk nomor order ini' });
      }
  
      res.status(201).json({success: true, data: IndeksList});
    } catch (error) {
      console.error('Gagal mendapatkan data Indeks:', error);
      res.status(500).json({ message: 'Gagal mendapatkan data Indeks' });
    }
  };
  

  
  exports.getAllIndeksDate = async (req, res) => {
    try {
      const { no_order,tanggal } = req.params;
  
      // Cari semua data Indeks berdasarkan nomor order
      const IndeksList = await PerhitunganIndeks.findAll({ where: { no_order,tanggal } });
  
      if (!IndeksList || IndeksList.length === 0) {
        return res.status(404).json({ message: 'Tidak ada data Indeks untuk nomor order ini' });
      }
  
      res.status(201).json({success: true, data: IndeksList});
    } catch (error) {
      console.error('Gagal mendapatkan data Indeks:', error);
      res.status(500).json({ message: 'Gagal mendapatkan data Indeks' });
    }
  };