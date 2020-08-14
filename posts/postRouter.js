const express = require("express");
const posts = require("./postDb");
const { validatePostId } = require("../middleware/post");

const router = express.Router();

router.get("/api/posts", (req, res) => {
  const options = {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
  };
  posts
    .get(options)
    .then((items) => {
      res.status(200).json(items);
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/api/posts/:id", validatePostId(), (req, res, next) => {
  posts
    .getById(req.params.id)
    .then((items) => {
      res.status(200).json(items);
    })
    .catch((error) => {
      next(error);
    });
});

router.delete("/api/posts/:id", validatePostId(), (req, res, next) => {
  posts
    .remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({
          message: "The post has been deleted.",
        });
      } else {
        res.status(404).json({
          message: "The post could not be found",
        });
      }
    })
    .catch(next);
});

router.put("/api/posts/:id", validatePostId(), (req, res, next) => {
  posts
    .update(req.params.id, req.body)
    .then((item) => {
      res.status(200).json(item);
    })
    .catch(next);
});

module.exports = router;
