const { Personel, Order,Absensi } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const { format } = require('date-fns');
const pdf = require('html-pdf');
const handlebars = require('handlebars');




exports.getDownloadByMonth = async (req, res) => {

  try {
    const {no_order, bulan, tahun} = req.params;

  const startDate = new Date(`${tahun}-${bulan}-01`);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1) - 1);

  const currentDate = new Date();
  const formattedDate = format(currentDate, 'dd-MM-yyyy');
  const daysInMonth = new Date(tahun, bulan, 0).getDate();

  // Cari nomor order yang sesuai
  const existingOrder = await Order.findOne({ where: { no_order } });
  const outputPath = `uploads/personel-${no_order}-${tahun}${bulan}.pdf`;
const filteredAbsen = [];
  if (!existingOrder) {
    return res.status(404).json({ message: 'Nomor order tidak ditemukan' });
  }

  const personelList = await Personel.findAll({ where: { no_order: no_order } });
 
  const absenList = await Absensi.findAll({
    where: {
      no_order,
      tanggal: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['tanggal', 'DESC']], // Opsional: Mengurutkan berdasarkan tanggal terbaru
  });

  const person = await Personel.findAll({ where: { no_order: no_order }, include:  {
    model: Absensi,
    where: {
        tanggal: {
            [Op.between]: [startDate, endDate]
        }
    },
    required: false, 
    order: ['tanggal', 'ASC']// Opsional: Mengurutkan berdasarkan tanggal terbaru
} });

 person.forEach(personel => {
  const filteredData = personel.Absensis.filter(absen=>{
    const absenDate = new Date(absen.tanggal);
   
    const filtering = (absenDate.getMonth()+1) == bulan && (absenDate.getFullYear()) == tahun;
    return filtering;
  }).map(absen=>absen.tanggal).sort((a,b)=>new Date(a) - new Date(b));
filteredAbsen.push(filteredData);

});

  const jumlahTanggal = daysInMonth;
  const jlh = daysInMonth;
  const tanggalan = Array.from({length: jumlahTanggal}, (_, i) => i + 1);

// const dataAbsen = person.Absensis;
// console.log(`data Absen ${filteredAbsen}`);

const templateContent = fs.readFileSync('personeltemplate.html', 'utf8');
const compiledTemplate = handlebars.compile(templateContent)
handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});


const htmlContent = compiledTemplate({
  no_order,
  formattedDate,
  bulan,
  tahun,
  jumlahTanggal,
 
  tglList: tanggalan.map((tanggal, index)=>({
    tgl:index+1
  })),

  personList: person.map((personel, index) => {
    const absen = personel.Absensis.map(absensi => ({
        tanggal: parseInt(absensi.tanggal.split('-')[2]), 
        keterangan: absensi.keterangan
    }));
    const tanggalList = Array.from({ length: jumlahTanggal }, (_, index) => index + 1);
    const presence = tanggalList.map(date => {
        const absensi = absen.find(item => item.tanggal === date); // Cari input absen untuk tanggal tertentu
        return absensi ? absensi.keterangan === 'Tidak Hadir' ? '' : absensi.keterangan : ''; // Jika ada input absen, gunakan keterangannya. Jika tidak, kosongkan.
    });
    return {
        no: index + 1,
        nama: personel.name,
        absen: absen,
        tanggalList: tanggalList,
        presence: presence // Menambahkan informasi kehadiran ke dalam objek personel
    };
})
 
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


exports.addPersonelByNoOrder = async (req, res) => {
  try {
    const { no_order } = req.params; // Mengambil "no_order" dari URL parameter
    const { name } = req.body;

    // Cari order berdasarkan no_order
    const order = await Order.findOne({ where: { no_order } });

    if (!order) {
      return res.status(404).json({ message: 'Order tidak ditemukan' });
    }

    // Buat data personel dan hubungkan dengan order
    const newPersonel = await Personel.create({ name,no_order });
    

    res.status(201).json(newPersonel);
  } catch (error) {
    console.error('Gagal menambahkan personel:', error);
    res.status(500).json({ message: 'Gagal menambahkan personel' });
  }
};


exports.getPersonelByNoOrder = async (req, res) => {
  try {
    const { no_order } = req.params; 

  
    const order = await Order.findOne({ where: { no_order } });

    if (!order) {
      return res.status(404).json({ message: 'Order tidak ditemukan' });
    }

  
    const personelList = await Personel.findAll({ where: { no_order: no_order } });

    res.status(200).json({success: true,data: personelList});
  } catch (error) {
    console.error('Gagal mendapatkan daftar personel:', error);
    res.status(500).json({ message: 'Gagal mendapatkan daftar personel' });
  }
};

exports.getAbsenPersonByDate = async (req, res) => {
  try {
    const { no_order,id, tanggal } = req.params; 

    const order = await Absensi.findOne({ where: { no_order:no_order} });

    if (!order) {
      return res.status(404).json({ message: 'Data Absen tidak ditemukan' });
    }

  
    const personelList = await Absensi.findAll({ where: { no_order: no_order,  id_personel : id, tanggal: tanggal} });

    res.status(200).json({success:true,data:personelList});
  } catch (error) {
    console.error('Gagal mendapatkan daftar personel:', error);
    res.status(500).json({ message: 'Gagal mendapatkan daftar personel' });
  }

};
 exports.getAbsenPersonByMonth = async (req, res) => {

  try {
   
    const {no_order, bulan, tahun, id} = req.params;

    const startDate = new Date(`${tahun}-${bulan}-01`);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1) - 1);

    // Cari nomor order yang sesuai
    const absenPersonel = await Order.findOne({ where: { no_order } });

    if (!absenPersonel) {
      return res.status(404).json({ message: 'Nomor order tidak ditemukan' });
    }

    const absenList = await Absensi.findAll({
      where: {
        no_order,
        id_personel : id,
        tanggal: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['tanggal', 'ASC']], // Opsional: Mengurutkan berdasarkan tanggal terbaru
    });


    if (!absenList || absenList.length === 0) {
      return res.status(404).json({ message: 'Tidak ada data absen' });
    }
    res.status(201).json({ success: true, data: absenList });
  } catch (error) {
    console.error('Gagal mendapatkan data absensi:', error);
    res.status(500).json({ message: 'Gagal mendapatkan data absensi' });
  }
 };

exports.getAbsenByMonth = async (req, res) => {

  try {
   
    const {no_order, bulan, tahun} = req.params;

    const startDate = new Date(`${tahun}-${bulan}-01`);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1) - 1);

    // Cari nomor order yang sesuai
    const absenPersonel = await Order.findOne({ where: { no_order } });

    if (!absenPersonel) {
      return res.status(404).json({ message: 'Nomor order tidak ditemukan' });
    }

    const absenList = await Absensi.findAll({
      where: {
        no_order,
        tanggal: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['tanggal', 'ASC']], // Opsional: Mengurutkan berdasarkan tanggal terbaru
    });


    if (!absenList || absenList.length === 0) {
      return res.status(404).json({ message: 'Tidak ada data absen' });
    }
    res.status(201).json({ success: true, data: absenList });
  } catch (error) {
    console.error('Gagal mendapatkan data absensi:', error);
    res.status(500).json({ message: 'Gagal mendapatkan data absensi' });
  }
};

exports.getAbsenByDate = async (req, res) => {
  try {
    const { no_order,tanggal } = req.params; 

  
    const order = await Absensi.findOne({ where: { no_order } });

    if (!order) {
      return res.status(404).json({ message: 'Order tidak ditemukan' });
    }

  
    const personelList = await Absensi.findAll({ where: { no_order: no_order,tanggal:tanggal } });

    res.status(200).json({success : true,data:personelList});
  } catch (error) {
    console.error('Gagal mendapatkan daftar personel:', error);
    res.status(500).json({ message: 'Gagal mendapatkan daftar personel' });
  }
};

exports.getAbsenByIdPerson = async (req, res) => {
  try {
    const { no_order,id } = req.params; 

    // const person = await Personel.findOne({where: {id : id}});
    const order = await Absensi.findOne({ where: { no_order:no_order} });

    if (!order) {
      return res.status(404).json({ message: 'Data Absen tidak ditemukan' });
    }

  
    const personelList = await Absensi.findAll({ where: { no_order: no_order,  id_personel : id },order: [['tanggal', 'ASC']], });
    res.status(200).json({success:true,data:personelList});
  } catch (error) {
    console.error('Gagal mendapatkan daftar personel:', error);
    res.status(500).json({ message: 'Gagal mendapatkan daftar personel' });
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

exports.updateAbsenById = async (req, res)=> {
  try {
    const { id, no_order} = req.params; 
    const {keterangan} = req.body;
    const order = await Order.findOne({ where: { no_order } });


    if (!order) {
      return res.status(404).json({ message: 'Order tidak ditemukan' });
    }
 
   
    const absensi = await Absensi.findOne({ where: { id: id } });
    if (!absensi) {
      return res.status(404).json({ message: 'Personel tidak ditemukan' });
    }

    // Lakukan update data personel
    await absensi.update({keterangan});

    res.status(201).json({ message: 'Data absen berhasil diupdate' });
  } catch (error) {
    console.error('Gagal mengupdate absen personel:', error);
    res.status(500).json({ message: 'Gagal mengupdate  personel' });
  }
};


exports.updatePersonelById = async (req, res) => {
  try {
    const { id} = req.params; 
    const { name } = req.body; 

   
    const personel = await Personel.findOne({ where: { id: id } });

    if (!personel) {
      return res.status(404).json({ message: 'Personel tidak ditemukan' });
    }

    // Lakukan update data personel
    await personel.update({name});

    res.status(200).json({ message: 'Data personel berhasil diupdate' });
  } catch (error) {
    console.error('Gagal mengupdate personel:', error);
    res.status(500).json({ message: 'Gagal mengupdate personel' });
  }
};
exports.deletePersonelById = async (req, res) => {
  try {
    const { id } = req.params; // Mengambil "name" dari URL parameter

    // Cari personel berdasarkan personel_name
    const personel = await Personel.findOne({ where: { id: id } });

    if (!personel) {
      return res.status(404).json({ message: 'Personel tidak ditemukan' });
    }

    // Hapus data personel
    await personel.destroy();

    res.status(200).json({ message: 'Data personel berhasil dihapus' });
  } catch (error) {
    console.error('Gagal menghapus personel:', error);
    res.status(500).json({ message: 'Gagal menghapus personel' });
  }
};