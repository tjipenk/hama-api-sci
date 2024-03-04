// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Personel extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
     
//     }
//   }
//   Personel.init({
//     name: DataTypes.STRING,
//     no_order: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'Personel',
//   });
//   return Personel;
// };

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Personel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association to Absensi
      Personel.hasMany(models.Absensi, { foreignKey: 'id_personel' });
    }
  }
  Personel.init({
    name: DataTypes.STRING,
    no_order: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Personel',
  });
  return Personel;
};
