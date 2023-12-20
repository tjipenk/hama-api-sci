'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PerhitunganIndeks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PerhitunganIndeks.init({
    no_order: DataTypes.STRING,
    lokasi: DataTypes.STRING,
    jenis_hama: DataTypes.STRING,
    indeks_populasi: DataTypes.INTEGER,
    tanggal: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PerhitunganIndeks',
  });
  return PerhitunganIndeks;
};