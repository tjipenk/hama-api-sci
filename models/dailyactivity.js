'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DailyActivity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DailyActivity.init({
    no_order: DataTypes.STRING,
    lokasi: DataTypes.STRING,
    jenis_treatment: DataTypes.STRING,
    hama_ditemukan: DataTypes.STRING,
    jumlah: DataTypes.INTEGER,
    tanggal: DataTypes.STRING,
    bukti_foto: DataTypes.STRING,
    keterangan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DailyActivity',
  });
  return DailyActivity;
};