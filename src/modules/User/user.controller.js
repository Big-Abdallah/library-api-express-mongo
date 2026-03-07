import { Router } from "express";
const router = Router   () ; 
import  * as userService from "./user.service.js" ;
router.get   ("/",        userService.getAllUsers);
router.get   ("/id",      userService.getUserById);
router.get   ("/email",   userService.getUserByEmail);
router.post  ("/signUp",  userService.signup);
router.post  ("/signin",  userService.signin);
router.delete("/",        userService.deleteUser);
router.patch ("/",        userService.updateUser);
router.get   ("/search",  userService.searchByName);


export default router ;