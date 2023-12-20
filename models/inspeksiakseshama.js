'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InspeksiAksesHama extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  InspeksiAksesHama.init({
  
    no_order: DataTypes.STRING,
    lokasi: DataTypes.STRING,
    bukti_foto: DataTypes.STRING,
    rekomendasi: DataTypes.STRING,
    tanggal: DataTypes.STRING,
    keterangan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'InspeksiAksesHama',
  });
  return InspeksiAksesHama;
};