import express from "express";
import protectRoute from "../middleware/protectRoute.js";

import { createPost,deletePost,createComment,likeUnlikePost,getAllPosts,getLikedPost,getPostLikedUser,getFolloingPost,getUserPost,deleteComment } from "../controllers/post.controllers.js";

const router = express.Router();

router.get("/user/:username",protectRoute,getUserPost)
router.get("/post/:id/likedUser",protectRoute,getPostLikedUser);
router.get("/following",protectRoute,getFolloingPost); 
router.get("/all",protectRoute,getAllPosts)
router.get("/likes/:id",protectRoute,getLikedPost)
router.post("/create", protectRoute, createPost);
router.post("/like/:id",protectRoute,likeUnlikePost);
router.post("/comment/:id", protectRoute, createComment);
router.delete("/:id", protectRoute, deletePost);
router.delete("/deletecomment/:postId/:commentId", protectRoute, deleteComment);


export default router;
