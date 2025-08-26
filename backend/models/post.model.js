// import mongoose from "mongoose";

// const postSchema = mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   text: {
//     type: String,
//   },
//   img: {
//     type: String,
//   },
//   likes: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   ],
//   comments:[
//     {
//         text:{
//             type:String,
//             required:true
//         },
//         user:{
//             type:mongoose.Schema.Types.ObjectId,
//             ref:"User",
//             required:true
//         }
//     },{timestamps:true}
//   ]
// },{timestamps:true});

// const Post = mongoose.model("Posts",postSchema)
// export default Post;



import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // ✅ timestamps inside comment schema
);

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    img: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    comments: [commentSchema], // ✅ embed comment schema
  },
  { timestamps: true } // ✅ timestamps for posts too
);

const Post = mongoose.model("Post", postSchema);
export default Post;
