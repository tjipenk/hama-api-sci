// routes.js

const express = require('express');
const router = express.Router();
const userController = require('./controller/userController');
const orderController = require('./controller/orderController');
const personelController = require('./controller/personelController');
const peralatanController = require('./controller/peralatanController');
const dailyController = require('./controller/dailyController');
const indeksController = require('./controller/indexController');
const inpeksiController = require('./controller/inspeksiController');
const pemakaianController = require('./controller/pemakaianController');
const authenticateToken = require('./controller/authMiddleware');

// user
router.post('/users/create', userController.createUser);
// order
router.post('/order/create',authenticateToken, orderController.createOrder);
router.get('/order/getall',authenticateToken, orderController.getAllOrders);
// personel
router.post('/personel/add/:no_order',authenticateToken, personelController.addPersonelByNoOrder);
router.put('/personel/update/:no_order/:id',authenticateToken, personelController.updatePersonelById);
router.delete('/personel/delete/:no_order/:id',authenticateToken, personelController.deletePersonelById);
router.get('/personel/getall/:no_order',authenticateToken, personelController.getPersonelByNoOrder);
//absen
router.post('/personel/absen/:no_order',authenticateToken, personelController.absenPersonel);
router.put('/personel/absen/update/:no_order/:id',authenticateToken, personelController.updateAbsenById);
router.get('/personel/absen/getall/:no_order/:tanggal',authenticateToken, personelController.getAbsenByDate);
router.get('/personel/absen/getall/:no_order/:tahun/:bulan',authenticateToken, personelController.getAbsenByMonth);
router.get('/personel/absen/name/:no_order/:id',authenticateToken, personelController.getAbsenByIdPerson);
router.get('/personel/absen/name/:no_order/:id/:tanggal',authenticateToken, personelController.getAbsenPersonByDate);
router.get('/personel/absen/name/:no_order/:id/:tahun/:bulan',authenticateToken, personelController.getAbsenPersonByMonth);

// peralatan
router.post('/peralatan/add/:no_order',authenticateToken, peralatanController.addPeralatan);
router.get('/peralatan/getall/:no_order',authenticateToken, peralatanController.getAllPeralatan);
router.get('/peralatan/getall/:no_order/:tanggal',authenticateToken, peralatanController.getPeralatanDate);
router.get('/peralatan/getall/:no_order/:tahun/:bulan',authenticateToken, peralatanController.getAllPeralatanByMonth);
router.get('/peralatan/download/:no_order/:tahun/:bulan',authenticateToken, peralatanController.getDownloadByMonth);

// daily
router.post('/daily/add/:no_order',authenticateToken, dailyController.addDaily);
router.get('/daily/getall/:no_order',authenticateToken, dailyController.getAllDaily);
router.get('/daily/getall/:no_order/:tanggal',authenticateToken, dailyController.getAllDailyDate);
router.get('/daily/getall/:no_order/:tahun/:bulan',authenticateToken, dailyController.getAllDailyByMonth);
// router.get('/daily/download/:no_order/:tahun/:bulan',authenticateToken, dailyController.getDownloadByMonth);


// indeks
router.post('/indeks/add/:no_order',authenticateToken, indeksController.addIndeks);
router.get('/indeks/getall/:no_order',authenticateToken, indeksController.getAllIndeks);
router.get('/indeks/getall/:no_order/:tanggal',authenticateToken, indeksController.getAllIndeksDate);
router.get('/indeks/getall/:no_order/:tahun/:bulan',authenticateToken, indeksController.getAllIndexByMonth);
router.get('/indeks/download/:no_order/:tahun/:bulan',authenticateToken, indeksController.getDownloadByMonth);


// inspeksi
router.post('/inspeksi/add/:no_order',authenticateToken, inpeksiController.addInspeksi);
router.get('/inspeksi/getall/:no_order',authenticateToken, inpeksiController.getAllInspeksi);
router.get('/inspeksi/getall/:no_order/:tanggal',authenticateToken, inpeksiController.getAllInspeksiDate);
router.get('/inspeksi/getall/:no_order/:tahun/:bulan',authenticateToken, inpeksiController.getAllInspeksiByMonth);
router.get('/inspeksi/download/:no_order/:tahun/:bulan',authenticateToken, inpeksiController.getDownloadByMonth);


// pemakaian
router.post('/pemakaian/add/:no_order',authenticateToken, pemakaianController.addPemakaian);
router.get('/pemakaian/getall/:no_order',authenticateToken, pemakaianController.getAllPemakaian);
router.get('/pemakaian/getall/:no_order/:tanggal',authenticateToken, pemakaianController.getAllPemakaianDate);
router.get('/pemakaian/getall/:no_order/:tahun/:bulan',authenticateToken, pemakaianController.getAllPemakaianByMonth);
router.get('/pemakaian/download/:no_order/:tahun/:bulan',authenticateToken, pemakaianController.getDownloadByMonth);

// auth
router.post('/login', userController.loginUser);

module.exports = router;