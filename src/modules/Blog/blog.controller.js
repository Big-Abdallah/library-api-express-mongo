import { Router } from "express";
import * as BlogService from "./blog.service.js"
const router = Router() ; 

router.get   ("/",        BlogService.getAllBlogs);
router.get   ("/id",      BlogService.getBlogById);
router.get   ("/user",    BlogService.getBlogsByUserId);
router.get   ("/search",  BlogService.searchByTitle);
router.post  ("/",        BlogService.createBlog);
router.patch ("/",        BlogService.updateBlog);
router.delete("/",        BlogService.deleteBlog);

export default router ;