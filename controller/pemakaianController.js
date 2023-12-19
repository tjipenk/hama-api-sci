
const { Order, MonitoringPemakaian} = require('../models');
const { Op } = require('sequelize');

exports.getAllPemakaianByMonth = async (req, res) => {
  try {
   
    const {no_order, bulan, tahun} = req.params;

    const startDate = new Date(`${tahun}-${bulan}-01`);
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
        return res.status(404).json({ error: 'Tidak ada data Pemakaian untuk nomor order ini' });
      }
  
      res.status(201).json({success: true, data: PemakaianList});
    } catch (error) {
      console.error('Gagal mendapatkan data Pemakaian:', error);
      res.status(500).json({ message: 'Gagal mendapatkan data Pemakaian' });
    }
  };
  