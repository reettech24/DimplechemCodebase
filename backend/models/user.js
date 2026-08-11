"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.EmployeeRole, {
        foreignKey: "employee_id",
        as: "employeeRole",
      });

      User.hasOne(models.JobDetail, {
        foreignKey: "employee_id",
        as: "jobDetail",
      });

      User.hasMany(models.LocalExpense, {
        foreignKey: "employee_id",
        as: "local_expenses",
      });

      User.hasOne(models.BankDetail, {
        foreignKey: "employee_id",
        as: "bankDetail",
      });

      User.hasMany(models.JobDetail, {
        foreignKey: "reporting_manager_id",
        as: "managedEmployees",
      });

      User.hasMany(models.Document, {
        foreignKey: "employee_id",
        as: "documents",
      });
    }
  }
  User.init(
    {
      emp_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true, // Initially null, will be updated after creation
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Username is required" },
          notEmpty: { msg: "Username cannot be empty" },
          len: {
            args: [3, 20],
            msg: "Username must be between 3 and 20 characters",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
        // validate: {
        //   notNull: { msg: 'Email is required' },
        //   notEmpty: { msg: 'Email cannot be empty' },
        //   isEmail: { msg: 'Must be a valid email address' },
        // },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Password is required" },
          notEmpty: { msg: "Password cannot be empty" },
          len: {
            args: [6, 100],
            msg: "Password must be at least 6 characters",
          },
          isStrongPassword(value) {
            const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
            if (!regex.test(value)) {
              throw new Error(
                "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
              );
            }
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isNumeric: { msg: "Phone number must contain only numbers" },
          len: {
            args: [10, 15],
            msg: "Phone number must be between 10 and 15 digits",
          },
        },
      },
      date_of_birth: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: { msg: "Date of Birth must be a valid date" },
          isBefore: {
            args: new Date().toISOString().split("T")[0],
            msg: "Date of Birth must be in the past",
          },
        },
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isIn: {
            args: [["male", "female", "other"]],
            msg: "Gender must be Male, Female, or Other",
          },
        },
      },
      profile_image: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //   isUrl: { msg: 'Profile Image must be a valid URL' },
        // },
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: { msg: "Fullname cannot be empty" },
          len: {
            args: [3, 50],
            msg: "Fullname must be between 3 and 50 characters",
          },
        },
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          notEmpty: { msg: "Address cannot be empty" },
          //len: { args: [10, 255], msg: 'Address must be between 10 and 255 characters' },
        },
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "suspended"),
        allowNull: true,
        defaultValue: "active",
      },
      aadhar_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure unique Aadhar numbers
      },
      pan_no: {
        type: DataTypes.STRING,
        allowNull: true,
        //unique: true, // Ensure unique PAN numbers
      },
      emergency_contact: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      digital_signature: {
        type: DataTypes.TEXT, // Storing base64 or file path
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      hooks: {
        async afterCreate(user) {
          // Generate emp_id after the record is created
          const newId = `EMP${String(user.id).padStart(2, "0")}`;

          // Update emp_id in the database
          await user.update({ emp_id: newId });
        },
      },
    }
  );
  return User;
};
