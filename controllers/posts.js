import express from 'express';
import mongoose from 'mongoose';


import PostMessage from '../models/postMessage.js';

const router = express.Router();

export const getPosts = async (req, res) => { 
    const {page} = req.query;
   
    try {
        const LIMIT = 8;// lmit in one page
        const startIndex = (Number(page) -1)*LIMIT;// get the starting index of page
        const total = await PostMessage.countDocuments({});



        const posts = await PostMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex);// sort order which one is create last time after that fixed limit of page then skip anothe time prevous page
                
        res.status(200).json({data : posts, currentPage : Number(page),numberOfPages: Math.ceil(total/LIMIT)});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// export const getPostsBySearch = async(req,res)=>{
//     const {searchQuery,tags} = req.query;
//     console.log(searchQuery,"jhljl");
//     try {
//         const title = new RegExp(searchQuery,'i');// i for all test Test TEST like same
       
//         const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});// this chose tiltel and tags 
//         res.json({ data: posts });//send that data in front-end
//     } catch (error) {
//         res.status(404).json({ message: error.message });
//     }
// }
export const commentPost = async(req,res)=>{
    const {id} = req.params;
    const {value} = req.body;
    try {
        const post = await PostMessage.findById(id);
        post.comments.push(value);
        const updatedPost = await PostMessage.findByIdAndUpdate(id,post,{new : true});
        res.json(updatedPost);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearch = async(req, res) => {
    const { searchQuery, tags } = req.query;
   try {
     
        const title = new RegExp(searchQuery, "i");

        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});

        res.json({ data: posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}


export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

/// second part till/////////////////////////////////////////////////////////////////////
// export const createPost = async (req, res) => {
//     const { title, message, selectedFile, creator, tags } = req.body;

//     const newPostMessage = new PostMessage({ title, message, selectedFile, creator, tags })

//     try {
//         await newPostMessage.save();

//         res.status(201).json(newPostMessage );
//     } catch (error) {
//         res.status(409).json({ message: error.message });
//     }
// }
////////////////////////////////////////////////////////////////////////////////////////////////
export const createPost = async (req, res) => {
    const post = req.body;

    const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })

    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    // const {id:_id} = req.params;// in here rename id ->_id so in this case use _id every where it is mongoose id 
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}
// till second part //////////////////////////////////////////////////////////////////

// export const deletePost = async (req, res) => {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

//     await PostMessage.findByIdAndRemove(id);

//     res.json({ message: "Post deleted successfully." });
// }

// export const likePost = async (req, res) => {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
//     const post = await PostMessage.findById(id);

//     const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true });
    
//     res.json(updatedPost);
// }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////


export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {//  req.userId check first in auth(middleware) then likePost excecuted so route order is alos important
        return res.json({ message: "Unauthenticated" });
      }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id ===String(req.userId));
    // validate like //now like is string array 

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json(updatedPost);
}


export default router;