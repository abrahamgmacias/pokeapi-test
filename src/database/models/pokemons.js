'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pokemons extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pokemons.init({
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    pk_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'pokemons',
  });
  return pokemons;
};