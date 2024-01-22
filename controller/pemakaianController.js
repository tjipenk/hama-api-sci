
const { Order, MonitoringPemakaian} = require('../models');
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

  const pemakaianList = await MonitoringPemakaian.findAll({
    where: {
      no_order,
      tanggal: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['tanggal', 'ASC']], // Opsional: Mengurutkan berdasarkan tanggal terbaru
  });

  // const peralatanNumbered = peralatanList.map((peralatan, index) => ({
  //   ...peralatan.toJSON(),
  //   no: index + 1,
  // }));

  // const doc = new PDFDocument();
  // doc.pipe(fs.createWriteStream(`peralatan-${tahun}${bulan}.pdf`));
  // const tableHeaders = [ 'Nama', 'Merk', 'Jumlah', 'Satuan', 'Kondisi'];
  // tableHeaders.forEach(header => {
  //   doc.text(200, 10, header, {underline: true});
  // });
  // doc.moveDown();

  // peralatanList.forEach(item =>{
  //  console.log(item);
  const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
  const outputPath = `uploads/pemakaian-${tahun}${bulan}.pdf`;
  doc.pipe(fs.createWriteStream(outputPath));


  // const tableHeaders = ['Name', 'Age', 'Other Info'];

  // Tambahkan header ke PDF
  doc
  .text('Monitoring Pemakaian Bahan Chemical / Non-Chemical', { align: 'center' });
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



    const pemakaianNumbered = pemakaianList.map((pemakaian, index) => ({
      ...pemakaian.toJSON(),
      no: index + 1,
    }));

    const table = {
      headers: [
        { label: "No", property: 'no', width: 30, renderer: null },
        { label: "Nama Bahan", property: 'name', width: 150, renderer: null },
        { label: "Bahan Aktif", property: 'bahan_aktif', width: 150, renderer: null }, 
        { label: "Merk", property: 'merk', width: 100, renderer: null }, 
        { label: "Stok Awal", property: 'stok_awal', width: 50, renderer: null }, 
        { label: "Satuan", property: 'satuan', width: 50, renderer: null },
        { label: "In", property: 'ins', width: 50, renderer: null }, 
        { label: "Out", property: 'out', width: 50, renderer: null }, 
        { label: "Stok Akhir", property: 'stok_akhir', width: 50, renderer: null }, 
        { label: "Satuan", property: 'satuanb', width: 50, renderer: null }, 
       
       
      ],    

      datas: pemakaianNumbered
     
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

exports.getAllPemakaianByMonth = async (req, res) => {
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

    const pemakaianList = await MonitoringPemakaian.findAll({
      where: {
        no_order,
        tanggal: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['tanggal', 'ASC']], // Opsional: Mengurutkan berdasarkan tanggal terbaru
    });


    if (!pemakaianList || pemakaianList.length === 0) {
      return res.status(404).json({ message: 'Tidak ada data pemakaian untuk kriteria ini' });
    }
    res.status(201).json({ success: true, data: pemakaianList });
  } catch (error) {
    console.error('Gagal mendapatkan data pemakaian:', error);
    res.status(500).json({ message: 'Gagal mendapatkan data pemakaian' });
  }
};

exports.addPemakaian = async (req, res) => {
    try {
      const {  name, bahan_aktif, merk, stok_awal, satuan,tanggal,out,ins,stok_akhir,satuanb } = req.body;
      const { no_order } = req.params;
      // Cari nomor order yang sesuai
      const existingOrder = await Order.findOne({ where: { no_order } });
  
      if (!existingOrder) {
        return res.status(404).json({ message: 'Nomor order tidak ditemukan' });
      }

      const existingPeralatan = await MonitoringPemakaian.findOne({
        where: { no_order, name },
      });
  
      if (existingPeralatan) {
        return res.status(409).json({ message: 'Data pemakaian sudah ada' });
      }
  
      // Tambahkan data Pemakaian ke dalam tabel
      const newPemakaian = await MonitoringPemakaian.create({ name, bahan_aktif, merk, stok_awal, satuan,tanggal,ins,no_order,out,stok_akhir,satuanb });
  
      res.status(201).json(newPemakaian);
    } catch (error) {
      console.error('Gagal menambahkan Pemakaian:', error);
      res.status(500).json({ message: 'Gagal menambahkan Pemakaian' });
    }
  };
  
  exports.getAllPemakaian = async (req, res) => {
    try {
      const { no_order } = req.params;
  
      // Cari semua data Pemakaian berdasarkan nomor order
      const PemakaianList = await MonitoringPemakaian.findAll({ where: { no_order },  order : [['tanggal', 'DESC']] });
  
      if (!PemakaianList || PemakaianList.length === 0) {
        return res.status(404).json({ message: 'Tidak ada data Pemakaian untuk nomor order ini' });
      }
  
      res.status(201).json({success: true, data: PemakaianList});
    } catch (error) {
      console.error('Gagal mendapatkan data Pemakaian:', error);
      res.status(500).json({ message: 'Gagal mendapatkan data Pemakaian' });
    }
  };
  

  
  exports.getAllPemakaianDate = async (req, res) => {
    try {
      const { no_order,tanggal } = req.params;
  
      // Cari semua data Pemakaian berdasarkan nomor order
      const PemakaianList = await MonitoringPemakaian.findAll({ where: { no_order,tanggal } });
  
      if (!PemakaianList || PemakaianList.length === 0) {
        return res.status(404).json({ message: 'Tidak ada data Pemakaian untuk nomor order ini' });
      }
  
      res.status(201).json({success: true, data: PemakaianList});
    } catch (error) {
      console.error('Gagal mendapatkan data Pemakaian:', error);
      res.status(500).json({ message: 'Gagal mendapatkan data Pemakaian' });
    }
  };
  