import { blogModel } from "../../DB/Models/blog.model.js";
import { UserModel } from "../../DB/Models/user.model.js";
import { Op } from "sequelize";

// GET ALL BLOGS
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await blogModel.findAll({
            where: { deletedAt: null },
            include: [{ model: UserModel, attributes: ["id", "firstName", "lastName", "email"] }]
        });
        if (blogs.length === 0)
            return res.status(404).json({ success: false, message: "No blogs found" });

        return res.status(200).json({ success: true, message: "success", data: blogs });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// GET BLOG BY ID
export const getBlogById = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id)
            return res.status(400).json({ success: false, message: "Please provide blog id" });

        const blog = await blogModel.findOne({
            where: { id, deletedAt: null },
            include: [{ model: UserModel, attributes: ["id", "firstName", "lastName", "email"] }]
        });
        if (!blog)
            return res.status(404).json({ success: false, message: "Blog not found" });

        return res.status(200).json({ success: true, message: "success", data: blog });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// GET BLOGS BY USER ID
export const getBlogsByUserId = async (req, res) => {
    try {
        const { UserId } = req.query;
        if (!UserId)
            return res.status(400).json({ success: false, message: "Please provide user id" });

        const blogs = await blogModel.findAll({
            where: { UserId, deletedAt: null },
            include: [{ model: UserModel, attributes: ["id", "firstName", "lastName", "email"] }]
        });
        if (blogs.length === 0)
            return res.status(404).json({ success: false, message: "No blogs found for this user" });

        return res.status(200).json({ success: true, message: "success", data: blogs });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// CREATE BLOG
export const createBlog = async (req, res) => {
    try {
        const { title, content, UserId } = req.body;

        if (!title || !content || !UserId)
            return res.status(400).json({ success: false, message: "Please provide title, content and UserId" });

        const user = await UserModel.findOne({ where: { id: UserId, deletedAt: null } });
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });

        const newBlog = await blogModel.create({
            title,
            content,
            UserId,
            deletedAt: null
        });

        return res.status(201).json({ success: true, message: "Blog created successfully", data: newBlog });

    } catch (error) {
        if (error.name === "SequelizeValidationError")
            return res.status(400).json({ success: false, message: "Validation error", errors: error.errors.map(e => e.message) });

        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// UPDATE BLOG
export const updateBlog = async (req, res) => {
    try {
        const { id, UserId, new_title, new_content } = req.body;

        if (!id || !UserId || !new_title || !new_content)
            return res.status(400).json({ success: false, message: "Please provide all fields" });

        const blog = await blogModel.findOne({ where: { id, UserId, deletedAt: null } });
        if (!blog)
            return res.status(404).json({ success: false, message: "Blog not found" });

        await blog.update({ title: new_title, content: new_content });

        return res.status(200).json({ success: true, message: "Blog updated successfully", data: blog });

    } catch (error) {
        if (error.name === "SequelizeValidationError")
            return res.status(400).json({ success: false, message: "Validation error", errors: error.errors.map(e => e.message) });

        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// SOFT DELETE BLOG
export const deleteBlog = async (req, res) => {
    try {
        const { id, UserId } = req.body;

        if (!id || !UserId)
            return res.status(400).json({ success: false, message: "Please provide blog id and user id" });

        const blog = await blogModel.findOne({ where: { id, UserId, deletedAt: null } });
        if (!blog)
            return res.status(404).json({ success: false, message: "Blog not found" });

        await blog.update({ deletedAt: new Date() });

        return res.status(200).json({ success: true, message: "Blog deleted successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// SEARCH BLOGS BY TITLE
export const searchByTitle = async (req, res) => {
    try {
        const { search } = req.query;

        if (!search)
            return res.status(400).json({ success: false, message: "Please provide search term" });

        const blogs = await blogModel.findAll({
            where: {
                title    : { [Op.like]: `%${search}` },
                deletedAt: null
            },
            include: [{ model: UserModel, attributes: ["id", "firstName", "lastName", "email"] }]
        });

        if (blogs.length === 0)
            return res.status(404).json({ success: false, message: "No blogs found" });

        return res.status(200).json({ success: true, message: "success", data: blogs });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};