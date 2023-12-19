const { Order } = require('../models');
const jwt = require('jsonwebtoken');


exports.createOrder = async (req, res) => {
    try {
      const { no_order, clientName } = req.body;
      const token = req.header('Authorization');
      const decoded = jwt.verify(token, 'secret_key'); 

      const newOrder = await Order.create({ no_order, id_user : decoded.userId, client_name: clientName });
      res.status(201).json({message: 'Order Berhasil dibuat',data:newOrder});
    } catch (error) {
     
      res.status(500).json({ message: 'Gagal membuat order' });
    }
  };

  exports.getAllOrders = async (req, res) => {
    try {
      // Ambil semua order dari database
      const token = req.header('Authorization');
      const decoded = jwt.verify(token, 'secret_key'); 

      const orders = await Order.findAll({where:{id_user:decoded.userId}});
      res.status(201).json({success:true,data:orders});
    } catch (error) {
      console.error('Gagal mengambil order:', error);
      res.status(500).json({ message: 'Gagal mengambil order' });
    }
  };