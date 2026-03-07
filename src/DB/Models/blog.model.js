import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";
import { UserModel } from "./user.model.js";
export const blogModel = sequelize.define ("Blog" ,
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
        },
        title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Title is required" },
            notEmpty: { msg: "Title cannot be empty" },
            len: { args: [3, 50], msg: "Title must be between 2 and 50 characters" },
            isAlphanumeric: { msg: "Title must contain only letters and numbers" }  // ✅ was isAlpha
        }
        },
        content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
        notNull: { msg: "Content is required" },
        notEmpty: { msg: "Content cannot be empty" },
        len: { args: [3, 2000], msg: "Content must be between 3 and 2000 characters" },
        
        }   
        },
        } , {
        timestamps: true,
        tableName: "blogs",
        updatedAt: "updateTimestamp" ,
        paranoid : true
        } )
        UserModel.hasMany(blogModel) ;
        blogModel.belongsTo(UserModel ) ;