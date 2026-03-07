import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";

export const UserModel = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "First name is required" },
            notEmpty: { msg: "First name cannot be empty" },
            len: { args: [2, 50], msg: "First name must be between 2 and 50 characters" },
            isAlpha: { msg: "First name must contain only letters" }
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Last name is required" },
            notEmpty: { msg: "Last name cannot be empty" },
            len: { args: [2, 50], msg: "Last name must be between 2 and 50 characters" },
            isAlpha: { msg: "Last name must contain only letters" }
        },
        
    },
    fullName: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.firstName}  ${this.lastName}`;
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Email address already in use" },
        validate: {
            notNull: { msg: "Email is required" },
            notEmpty: { msg: "Email cannot be empty" },
            isEmail: { msg: "Must be a valid email address" },
            len: { args: [5, 100], msg: "Email must be between 5 and 100 characters" }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Password is required" },
            notEmpty: { msg: "Password cannot be empty" },
            len: { args: [8, 255], msg: "Password must be at least 8 characters" },
            isStrongPassword(value) {
                const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
                if (!strongPasswordRegex.test(value)) {
                    throw new Error(
                        "Password must contain uppercase, lowercase, number, and special character"
                    );
                }
            }
        }
    },
    gender: {
        type: DataTypes.ENUM("male", "female"),
        defaultValue: "male",
        allowNull: true,
        validate: {
            isIn: { args: [["male", "female"]], msg: "Gender must be either male or female" }
        }
    },
    DOB: {
        type: DataTypes.DATEONLY,
        validate: {
            isDate: { msg: "Date of birth must be a valid date" },
            isBeforeToday(value) {
                if (value && new Date(value) >= new Date()) {
                    throw new Error("Date of birth must be in the past");
                }
            },
            isOldEnough(value) {
                if (value) {
                    const age = new Date().getFullYear() - new Date(value).getFullYear();
                    if (age < 13) {
                        throw new Error("User must be at least 13 years old");
                    }
                }
            }
        }
    },
    confirmEmail: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        validate: {
            isBoolean(value) {
                if (typeof value !== "boolean") {
                    throw new Error("confirmEmail must be a boolean value");
                }
            }
        }
    }
},
{
    timestamps: true,
    tableName: "users",
    updatedAt: "updateTimestamp" ,
    paranoid : true
}); 