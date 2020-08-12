const express = require("express");
const users = require("./userDb");
const { validateUserId, validateUser } = require("../middleware/user");
const { validatePost } = require("../middleware/post");

const router = express.Router();

router.post("/api/users", validateUser(), (req, res) => {
  users
    .insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      next(error);
    });
});

router.post(
  "/api/users/:id/posts",
  validateUserId(),
  validatePost(),
  (req, res, next) => {
    users
      .addUserPost(req.params.id, req.body)
      .then((post) => {
        res.status(201).json(post);
      })
      .catch(next);
  }
);

router.get("/api/users", (req, res) => {
  const options = {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
  };
  users
    .get(options)
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/api/users/:id", validateUserId(), (req, res) => {
  res.status(200).json(req.user);
});

router.get("/api/users/:id/posts", validateUserId(), (req, res, next) => {
  users
    .getUserPosts(req.params.id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch(next);
});

router.delete("/api/users/:id", validateUserId(), (req, res, next) => {
  users
    .remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({
          message: "The user has been nuked",
        });
      } else {
        res.status(404).json({
          message: "The user could not be found",
        });
      }
    })
    .catch(next);
});

router.put(
  "/api/users/:id",
  validateUser(),
  validateUserId(),
  (req, res, next) => {
    users
      .update(req.params.id, req.body)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch(next);
  }
);

module.exports = router;
