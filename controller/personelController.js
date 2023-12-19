const { Personel, Order,Absensi } = require('../models');

exports.addPersonelByNoOrder = async (req, res) => {
  try {
    const { no_order } = req.params; // Mengambil "no_order" dari URL parameter
    const { name } = req.body;

    // Cari order berdasarkan no_order
    const order = await Order.findOne({ where: { no_order } });

    if (!order) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }

    // Buat data personel dan hubungkan dengan order
    const newPersonel = await Personel.create({ name,no_order });
    

    res.status(201).json(newPersonel);
  } catch (error) {
    console.error('Gagal menambahkan personel:', error);
    res.status(500).json({ error: 'Gagal menambahkan personel' });
  }
};


exports.getPersonelByNoOrder = async (req, res) => {
  try {
    const { no_order } = req.params; 

  
    const order = await Order.findOne({ where: { no_order } });

    if (!order) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }

  
    const personelList = await Personel.findAll({ where: { no_order: no_order } });

    res.status(200).json({success: true,data: personelList});
  } catch (error) {
    console.error('Gagal mendapatkan daftar personel:', error);
    res.status(500).json({ error: 'Gagal mendapatkan daftar personel' });
  }
};

exports.getAbsenByNoOrder = async (req, res) => {
  try {
    const { no_order,tanggal } = req.params; 

  
    const order = await Absensi.findOne({ where: { no_order } });

    if (!order) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }

  
    const personelList = await Absensi.findAll({ where: { no_order: no_order,tanggal:tanggal } });

    res.status(200).json({success : true,data:personelList});
  } catch (error) {
    console.error('Gagal mendapatkan daftar personel:', error);
    res.status(500).json({ error: 'Gagal mendapatkan daftar personel' });
  }
};

exports.getAbsenByIdPerson = async (req, res) => {
  try {
    const { no_order,id } = req.params; 

    // const person = await Personel.findOne({where: {id : id}});
    const order = await Absensi.findOne({ where: { no_order:no_order} });

    if (!order) {
      return res.status(404).json({ error: 'Data Absen tidak ditemukan' });
    }

  
    const personelList = await Absensi.findAll({ where: { no_order: no_order,  id_personel : id } });

    res.status(200).json({success:true,data:personelList});
  } catch (error) {
    console.error('Gagal mendapatkan daftar personel:', error);
    res.status(500).json({ error: 'Gagal mendapatkan daftar personel' });
  }
};

exports.absenPersonel = async (req, res) => {
  try {
    const { no_order } = req.params; 
    const { keterangan, id_person, tanggal } = req.body;

    const order = await Order.findOne({ where: { no_order } });
    const person = await Personel.findOne({where: {id : id_person}});
    const absen = await Absensi.findOne({where: {tanggal : tanggal, name: person.name}});
    


    if (!order) {
      return res.status(404).json({ message: 'Order tidak ditemukan' });
    }
 
    const { name } = person;
    if (absen ) {
      return res.status(400).json({ message: `${name} sudah absen` });
    }
    
   await Absensi.create({ name, no_order, tanggal, keterangan, id_personel: person.id });
   
    res.status(200).json({message: `${name} ${keterangan}`});
  } catch (error) {
    res.status(500).json({ message: 'Gagal absen' });
  }
};


exports.updatePersonelById = async (req, res) => {
  try {
    const { id} = req.params; 
    const { name } = req.body; 

   
    const personel = await Personel.findOne({ where: { id: id } });

    if (!personel) {
      return res.status(404).json({ error: 'Personel tidak ditemukan' });
    }

    console.log(personel);
    console.log(name);
    // Lakukan update data personel
    await personel.update({name});

    res.status(200).json({ message: 'Data personel berhasil diupdate' });
  } catch (error) {
    console.error('Gagal mengupdate personel:', error);
    res.status(500).json({ error: 'Gagal mengupdate personel' });
  }
};
exports.deletePersonelById = async (req, res) => {
  try {
    const { id } = req.params; // Mengambil "name" dari URL parameter

    // Cari personel berdasarkan personel_name
    const personel = await Personel.findOne({ where: { id: id } });

    if (!personel) {
      return res.status(404).json({ error: 'Personel tidak ditemukan' });
    }

    // Hapus data personel
    await personel.destroy();

    res.status(200).json({ message: 'Data personel berhasil dihapus' });
  } catch (error) {
    console.error('Gagal menghapus personel:', error);
    res.status(500).json({ error: 'Gagal menghapus personel' });
  }
};