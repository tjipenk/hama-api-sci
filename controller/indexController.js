
const { Order, PerhitunganIndeks} = require('../models');
const { Op } = require('sequelize');



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