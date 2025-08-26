import User from "../models/user.model.js";
import cloudinary from "cloudinary";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js"

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }
    if (!text && !img) {
      return res.status(400).json({ error: "Post must constain text or img" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;  
    }

    const newPost = new Post({
      user: userId, 
      text,
      img,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log(`error in post controllers ${error}`);
    res.status(500).json({ error: "invalid server error" });
  }
};


export const deletePost=async(req,res)=>{
    try {
        const {id}=req.params;
        const post = await Post.findOne({_id:id});
        if(!post){
            return res.status(404).json({error:"Post not found"});
        }
        if(post.user.toString() !== req.user._id.toString()){
            res.status(401).json({error:"You are not authorized to delete this post"})
        }
        if(post.img){
            const imgId=post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
        await Post.findByIdAndDelete({_id:id})
        res.status(200).json({message:"Post deleted successfully"})
    } catch (error) {
        console.log(`error in delete post controllers ${error}`);
        res.status(500).json({ error: "invalid server error" });
    }
}

export const createComment=async(req,res)=>{
  try {
    const {text}=req.body;
    const postId=req.params.id;
    const userId=req.user._id;
    const post =await Post.findById({_id:postId});
    if(!text){
      return res.status(400).json({error:"Must enter any text"})
    }
    if(!post){
      return res.status(400).json({error:"Post not found"})
    }
    const comment={
      user:userId,
      text:text
    }
    post.comments.push(comment);
    await post.save();
    res.status(200).json(post)
  } catch (error) {
    console.log(`Error in create comment :${error}`);
    res.status(500).json({error:"Internal server Error"});
  }
}

// export const likeUnlikePost = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { id: postId } = req.params;

//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     const alreadyLiked = post.likes.includes(userId);

//     if (alreadyLiked) {
//       // Unlike post
//       post.likes.pull(userId);
//       await post.save();
//       await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
//       const updatedLikes=post.likes.filter((id)=>id.toString()!==userId.toString())
//       res.status(200).json(updatedLikes);
//     } else {
//       // Like post
//       post.likes.push(userId);
//       await post.save();
//       await User.updateOne(
//         { _id: userId },
//         { $addToSet: { likedPosts: postId } }
//       );

//       const notification = new Notification({
//         from: userId,
//         to: post.user,
//         type: "like",
//       });
//       await notification.save();
//       const updatedLikes=post.likes
//       res.status(200).json(updatedLikes);
//     }
//   } catch (error) {
//     console.log(`Error in likeUnlikePost: ${error}`);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // only owner of the comment OR post owner can delete
    if (comment.user.toString() !== userId.toString() && post.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this comment" });
    }

    comment.deleteOne(); // remove the comment
    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("comments.user", "fullName username profileImg");

    res.json({ comments: updatedPost.comments });
  } catch (error) {
    console.log(`Error deleting comment: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    // Find post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike post
      await Post.updateOne(
        { _id: postId },
        { $pull: { likes: userId } }
      );

      await User.updateOne(
        { _id: userId },
        { $pull: { likedPosts: postId } }
      );

      const updatedPost = await Post.findById(postId).select("likes");
      return res.status(200).json(updatedPost.likes);

    } else {
      // Like post
      await Post.updateOne(
        { _id: postId },
        { $addToSet: { likes: userId } }
      );

      await User.updateOne(
        { _id: userId },
        { $addToSet: { likedPosts: postId } }
      );

      // Save notification (don’t notify yourself)
      if (post.user.toString() !== userId.toString()) {
        const notification = new Notification({
          from: userId,
          to: post.user,
          type: "like", 
        });
        await notification.save();
      }

      const updatedPost = await Post.findById(postId).select("likes");
      
      
      return res.status(200).json(updatedPost.likes);
    }
  } catch (error) {
    console.error(`Error in likeUnlikePost: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getAllPosts=async(req,res)=>{
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if(posts.length===0){
      return res.status(400).json([])
    }
    res.status(200).json(posts)
  } catch (error) {
    console.log(`Error in get all post :${error}`);
    res.status(500).json({ error: "Internal server Error" });
  }
}


export const getLikedPost= async(req,res)=>{
  try {
    const userId=req.params.id;
    const user=await User.findById({_id:userId});
    if(!user){
      return res.status(404).json({error:"user not found"})
    }
    const likedPosts=await Post.find({_id:{$in:user.likedPosts}})
      .populate({
        path:"user",
        select:"-password"
      })
      .populate({
        path:"comments.user",
        select:"-password"
      })
      res.status(200).json(likedPosts)
  } catch (error) {
    console.log(`Error in get liked post :${error}`);
    res.status(500).json({ error: "Internal server Error" }); 
  }
}

export const getPostLikedUser=async(req,res)=>{
  try {
    const postId=req.params.id;
    const post=await Post.findById({_id:postId})
      .populate({
        path: "likes",
        select: "-password",
      })
    if(!post){
      return res.status(404).json({error:"user not found"})
    }
    res.status(200).json(post.likes)
  } catch (error) {
    console.log(`Error in get post liked users :${error}`);
    res.status(500).json({ error: "Internal server Error" }); 
  }
}

export const getFolloingPost=async(req,res)=>{
  try {
    const userId=req.user._id;
    const user=await User.findById({_id:userId});
    if(!user){
      return res.status(404).json({error:"user not found"})
    }
    const following=user.following;
    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
      res.status(200).json(feedPosts)
  } catch (error) {
    console.log(`Error in get following post :${error}`);
    res.status(500).json({ error: "Internal server Error" }); 
  }
}



export const getUserPost = async (req, res) => {
  try {
    const {username} = req.params;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
  
    const UserPosts = await Post.find({user:user._id})
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(UserPosts);
  } catch (error) {
    console.log(`Error in get user post :${error}`);
    res.status(500).json({ error: "Internal server Error" });
  }
};