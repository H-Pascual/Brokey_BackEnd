const { DataTypes } = require("sequelize");
const sequelize = require("../connection");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const User = sequelize.define(
  "User",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Surname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Password: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    IBAN: {
      type: DataTypes.STRING(24),
      allowNull: true,
    },
    Email: {
      type: DataTypes.STRING(200),
      allowNull: true,
      unique: true,
    },
    TotalInvested: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    TotalCash: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

async function createUserTable() {
  try {
    await User.sync();
    console.log("Tabla de usuarios creada correctamente.");
  } catch (error) {
    console.error("Error al crear la tabla de usuarios:", error);
  }
}

async function insertUserValues(
  username,
  name,
  surname,
  password,
  iban,
  email
) {
  try {
    if (ValidateUserValues(username, name, surname, password, iban, email)) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = await User.create({
        Username: username,
        Name: name,
        Surname: surname,
        Password: hashedPassword,
        IBAN: iban,
        Email: email,
        TotalInvested: 0,
        TotalCash: 0,
      });
      console.log("Usuario insertado correctamente");
      return user;
    } else {
      console.log("Formato de usuario erroneo");
    }
  } catch (error) {
    console.error("Error al insertar usuario:", error);
  }
}

function ValidateUsername(username){
  const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
  if (!usernameRegex.test(username)) {
    return false;
  }
  return true;
}

function ValidateName(name){
  if (typeof name !== "string" || name.length < 1 || name.length > 50) {
    return false;
  }
  return true;
}

function ValidateSurname(surname){
  if (
    typeof surname !== "string" ||
    surname.length < 1 ||
    surname.length > 50
  ) {
    return false;
  }
  return true;
}

function ValidatePassword(password){
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return false;
  }
  return true;
}

function ValidateIBAN(iban){
    if (
      typeof iban !== "string" ||
      iban.length !== 24 ||
      !/^[a-zA-Z0-9]*$/.test(iban)
    ) {
      return false;
    }
  return true;
}

function ValidateEmail(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }
  return true;
}

function ValidateUserValues(username, name, surname, password, iban, email) {
  if(!ValidateUsername(username))
    return false;
  if(!ValidateName(name))
    return false;
  if(!ValidateSurname(surname))
    return false;
  if(!ValidatePassword(password))
    return false;
  if(iban){
    if(!ValidateIBAN(iban))
      return false;
  }
  if(email){
    if(!ValidateEmail(email))
      return false;
  }
  return true;
}
async function updateUserName(id, name, surname) {
  try {
    const user = await User.findByPk(id);

    if (user) {
      if(ValidateName(name) && ValidateSurname(surname)){
        const userUpdate = await user.update({
          Name: name,
          Surname: surname,
        });
        console.log(`Usuario con ID ${id} actualizado correctamente.`);
        return userUpdate;
      }else{
        console.log("Formato de username erroneo");
      }
    } else {
      console.log(`No se encontró ningún usuario con ID ${id}.`);
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
  }
}

async function updateUserPassword(id, password) {
  try {
    const user = await User.findByPk(id);

    if (user) {
      if(ValidatePassword(password)){
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userUpdate = await user.update({
          Password: hashedPassword,
        });
        console.log(`Usuario con ID ${id} actualizado correctamente.`);
        return userUpdate;
      }else{
        console.log("Formato de contraseña erroneo");
      }
    } else {
      console.log(`No se encontró ningún usuario con ID ${id}.`);
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
  }
}

async function updateUserEmail(id, email) {
  try {
    const user = await User.findByPk(id);

    if (user) {
      if(ValidateEmail(email)){
        const userUpdate = await user.update({
          Email: email,
        });
        console.log(`Usuario con ID ${id} actualizado correctamente.`);
        return userUpdate;
      }else{
        console.log("Formato de email erroneo");
      }
    } else {
      console.log(`No se encontró ningún usuario con ID ${id}.`);
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
  }
}

async function updateUserIban(id, iban) {
  try {
    const user = await User.findByPk(id);

    if (user) {
      if(ValidateIBAN(iban)){
        const userUpdate = await user.update({
          IBAN: iban,
        });
        console.log(`Usuario con ID ${id} actualizado correctamente.`);
        return userUpdate;
      }else{
        console.log("Formato de IBAN erroneo");
      }
    } else {
      console.log(`No se encontró ningún usuario con ID ${id}.`);
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
  }
}

async function updateUserTotalInvested(id, quantity) {
  try {
    const user = await User.findByPk(id);
    totalInvested = quantity + user.TotalInvested;
    if (user) {
      await user.update({
        TotalInvested: totalInvested,
      });
      console.log(`Usuario con ID ${id} actualizado correctamente.`);
    } else {
      console.log(`No se encontró ningún usuario con ID ${id}.`);
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
  }
}

async function updateUserTotalCash(id, quantity) {
  try {
    const user = await User.findByPk(id);
    totalCash = quantity + user.TotalCash;
    if (user) {
      if (totalCash >= 0) {
        await user.update({
          TotalCash: totalCash,
        });
        console.log(`Usuario con ID ${id} actualizado correctamente.`);
        return true;
      } else {
        console.log(`El dinero total del usuario no puede ser negativo`);
        return false;
      }
    } else {
      console.log(`Error al actualizar usuario con ID ${id}.`);
      return false;
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
  }
}

module.exports = {
  createUserTable: createUserTable,
  insertUserValues: insertUserValues,
  updateUserName: updateUserName,
  updateUserPassword: updateUserPassword,
  updateUserEmail: updateUserEmail,
  updateUserIban: updateUserIban,
  updateUserTotalInvested: updateUserTotalInvested,
  updateUserTotalCash: updateUserTotalCash,
  User: User,
};
