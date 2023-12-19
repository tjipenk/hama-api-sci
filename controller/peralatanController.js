
const { Order, MonitoringPeralatan} = require('../models');
const { Op } = require('sequelize');

exports.getAllPeralatanByMonth = async (req, res) => {
  try {
   
    const {no_order, bulan, tahun} = req.params;

    const startDate = new Date(`${tahun}-${bulan}-01`);
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

    console.log(peralatanList);

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
  