// import express from 'express';
import { Router } from 'express'
import Post from '../models/post';
// import { authUser } from '../middleware/check-auth';

const router = Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};



router.post('',(req, res, next) => {
  // const post = new Post({
  //   title: req.body.title,
  //   content: req.body.content,
  //   creator: req.userData.userId
  // });
  Post.create(req.body, (err, post) => {
    if (err) return next(err);
    res.status(201).json({
      message: 'Post successfully Added',
      post: post,
    });
  });

  // Post.save(req.body, (err,post)=> {
  //   if (err) return next(err);
  //   res.json(post)
  // })

  // post.save().then((createdPost) => {
  //   res.status(201).json({
  //     message: "Post Added Successfully",
  //     postId: createdPost._id,
  //   });
  // });
});

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    creator: req.userData.userId,
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then((result: any) => {
    if (result.nModified > 0) {
      res.status(200).json({ message: 'Update Successful' });
    } else {
      res.status(401).json({ message: 'Not Authorized' });
    }
  });
});

router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count,
      });
    });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  });
});

router.delete('/:id',(req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then((result: any) => {
    console.error(result);
    if (result.n > 0) {
      res.status(200).json({ message: 'Deletion Successful' });
    } else {
      res.status(401).json({ message: 'Not Authorized' });
    }
  });
});

const Posts = router;
export default Posts;
