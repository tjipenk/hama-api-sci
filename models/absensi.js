// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Absensi extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Absensi.init({
//     id_personel: DataTypes.INTEGER,
//     name: DataTypes.STRING,
//     tanggal: DataTypes.STRING,
//     no_order: DataTypes.STRING,
//     keterangan: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'Absensi',
//   });
//   return Absensi;
// };

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Absensi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association to Personel
      Absensi.belongsTo(models.Personel, { foreignKey: 'id_personel' });
    }
  }
  Absensi.init({
    id_personel: DataTypes.INTEGER,
    name: DataTypes.STRING,
    tanggal: DataTypes.STRING,
    no_order: DataTypes.STRING,
    keterangan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Absensi',
  });
  return Absensi;
};
