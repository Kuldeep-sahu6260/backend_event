import express from 'express';


import {getPostsBySearch ,commentPost, getPosts, getPost, createPost, updatePost, likePost, deletePost } from '../controllers/posts.js';
import auth from "../middleware/auth.js";
const router = express.Router();

router.get('/', getPosts);
router.get(`/search`, getPostsBySearch);// you mush put this is ony here other wise its not work
router.get('/:id', getPost);
router.post('/', auth, createPost);
// router.get('/:id', getPost);// get post particular user
router.patch('/:id',auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth,likePost);
router.post('/:id/commentPost', auth,commentPost);



export default router;