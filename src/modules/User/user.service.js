import { UserModel } from "../../DB/Models/user.model.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// GET ALL USERS
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.findAll({
            where: { deletedAt: null },
            attributes: { exclude: ["password"] } 
        });
        if (users.length === 0)
            return res.status(404).json({ success: false, message: "No users found" });

        return res.status(200).json({ success: true, message: "success", data: users });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id)
            return res.status(400).json({ success: false, message: "Please provide user id" });

        const user = await UserModel.findOne({
            where: { id, deletedAt: null },
            attributes: { exclude: ["password"] } // ✅
        });
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });

        return res.status(200).json({ success: true, message: "success", data: user });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// GET USER BY EMAIL
export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email)
            return res.status(400).json({ success: false, message: "Please provide user email" });

        const user = await UserModel.findOne({
            where: { email, deletedAt: null },
            attributes: { exclude: ["password"] } // ✅
        });
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });

        return res.status(200).json({ success: true, message: "success", data: user });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// SIGN UP
export const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, rePassword, gender, DOB } = req.body;

        if (!firstName || !lastName || !email || !password || !rePassword || !gender || !DOB)
            return res.status(400).json({
                success: false,
                message: "Please provide firstName, lastName, email, password, gender and date of birth"
            });

        if (password !== rePassword)
            return res.status(400).json({ success: false, message: "Password and confirm password don't match" });

        const existingUser = await UserModel.findOne({ where: { email } });
        if (existingUser)
            return res.status(409).json({ success: false, message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            password    : hashedPassword,
            gender      : gender || "male",
            DOB,
            confirmEmail: false,
            deletedAt   : null
        });

        const { password: _, ...userData } = newUser.toJSON();
        return res.status(201).json({ success: true, message: "New user created", data: userData });

    } catch (error) {
        if (error.name === "SequelizeValidationError")
            return res.status(400).json({ success: false, message: "Validation error", errors: error.errors.map(e => e.message) });
        if (error.name === "SequelizeUniqueConstraintError")
            return res.status(409).json({ success: false, message: "User already exists" });

        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// SIGN IN
export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ success: false, message: "Please provide email and password" });

        const user = await UserModel.findOne({ where: { email, deletedAt: null } });
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ success: false, message: "Incorrect password" });

        const { password: _, ...userData } = user.toJSON();
        return res.status(200).json({ success: true, message: "User signed in successfully", data: userData });

    } catch (error) {
        if (error.name === "SequelizeValidationError")
            return res.status(400).json({ success: false, message: "Validation error", errors: error.errors.map(e => e.message) });

        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// SOFT DELETE
export const deleteUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ success: false, message: "Please provide email and password" });

        const user = await UserModel.findOne({ where: { email, deletedAt: null } });
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ success: false, message: "Incorrect password" });

        await user.update({ deletedAt: new Date() });

        return res.status(200).json({ success: true, message: "User deleted successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// UPDATE USER
export const updateUser = async (req, res) => {
    try {
        const { email, password, new_name, new_password } = req.body;

        if (!email || !password || !new_name || !new_password)
            return res.status(400).json({ success: false, message: "Please provide all fields" });

        const user = await UserModel.findOne({ where: { email, deletedAt: null } });
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ success: false, message: "Incorrect password" });

        const hashedNewPassword = await bcrypt.hash(new_password, SALT_ROUNDS);
        await user.update({ firstName: new_name, password: hashedNewPassword });

        return res.status(200).json({ success: true, message: "User updated successfully" });

    } catch (error) {
        if (error.name === "SequelizeValidationError")
            return res.status(400).json({ success: false, message: "Validation error", errors: error.errors.map(e => e.message) });

        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// SEARCH BY NAME
export const searchByName = async (req, res) => {
    try {
        const { search } = req.query;

        if (!search)
            return res.status(400).json({ success: false, message: "Please provide search term" });

        const users = await UserModel.findAll({
            where: {
                firstName: { [Op.like]: `%${search}%` },
                deletedAt: null
            },
            attributes: { exclude: ["password"] } // ✅
        });

        if (users.length === 0)
            return res.status(404).json({ success: false, message: "No users found" });

        return res.status(200).json({ success: true, message: "success", data: users });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};