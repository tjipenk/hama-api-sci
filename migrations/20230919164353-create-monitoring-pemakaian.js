'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MonitoringPemakaians', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      no_order: {
        type: Sequelize.STRING
      },
      satuan: {
        type: Sequelize.STRING
      },
      satuanb: {
        type: Sequelize.STRING
      },
      ins: {
        type: Sequelize.INTEGER
      },
      out: {
        type: Sequelize.INTEGER
      },
      stok_akhir: {
        type: Sequelize.INTEGER
      },
      stok_awal: {
        type: Sequelize.INTEGER
      },
      merk: {
        type: Sequelize.STRING
      },
      tanggal: {
        type: Sequelize.STRING
      },
      bahan_aktif: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MonitoringPemakaians');
  }
};