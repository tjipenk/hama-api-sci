'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MonitoringPeralatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MonitoringPeralatan.init({
    name: DataTypes.STRING,
    no_order: DataTypes.STRING,
    merek: DataTypes.STRING,
    jumlah: DataTypes.INTEGER,
    satuan: DataTypes.STRING,
    kondisi: DataTypes.STRING,
    tanggal: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MonitoringPeralatan',
  });
  return MonitoringPeralatan;
};