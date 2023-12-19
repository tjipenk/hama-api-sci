
const { Order, PerhitunganIndeks} = require('../models');

exports.addIndeks = async (req, res) => {
    try {
      const {  name, lokasi, jenis_hama, indeks_populasi, jumlah,tanggal,status } = req.body;
      const { no_order } = req.params;
      // Cari nomor order yang sesuai
      const existingOrder = await Order.findOne({ where: { no_order } });
  
      if (!existingOrder) {
        return res.status(404).json({ error: 'Nomor order tidak ditemukan' });
      }
      const existingPeralatan = await PerhitunganIndeks.findOne({
        where: { no_order, name },
      });
  
      if (existingPeralatan) {
        return res.status(409).json({ error: 'Data index sudah ada' });
      }
  
      // Tambahkan data Indeks ke dalam tabel
      const newIndeks = await PerhitunganIndeks.create({ name, lokasi, jenis_hama, indeks_populasi, jumlah,tanggal,status,no_order });
  
      res.status(201).json(newIndeks);
    } catch (error) {
      console.error('Gagal menambahkan Indeks:', error);
      res.status(500).json({ error: 'Gagal menambahkan Indeks' });
    }
  };
  
  exports.getAllIndeks = async (req, res) => {
    try {
      const { no_order } = req.params;
  
      // Cari semua data Indeks berdasarkan nomor order
      const IndeksList = await PerhitunganIndeks.findAll({ where: { no_order } });
  
      if (!IndeksList || IndeksList.length === 0) {
        return res.status(404).json({ error: 'Tidak ada data Indeks untuk nomor order ini' });
      }
  
      res.status(200).json(IndeksList);
    } catch (error) {
      console.error('Gagal mendapatkan data Indeks:', error);
      res.status(500).json({ error: 'Gagal mendapatkan data Indeks' });
    }
  };
  

  
  exports.getAllIndeksDate = async (req, res) => {
    try {
      const { no_order,tanggal } = req.params;
  
      // Cari semua data Indeks berdasarkan nomor order
      const IndeksList = await PerhitunganIndeks.findAll({ where: { no_order,tanggal } });
  
      if (!IndeksList || IndeksList.length === 0) {
        return res.status(404).json({ error: 'Tidak ada data Indeks untuk nomor order ini' });
      }
  
      res.status(200).json(IndeksList);
    } catch (error) {
      console.error('Gagal mendapatkan data Indeks:', error);
      res.status(500).json({ error: 'Gagal mendapatkan data Indeks' });
    }
  };