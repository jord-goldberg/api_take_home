import elasticsearch from "../elasticsearch";
import express from "express";
import User from "../models/users.model";
const router = express.Router();

/* GET users listing. */
router.get("/", (req, res, next) => {
  const { first_name } = req.query;
  const q = first_name ? `first_name:${first_name}` : undefined;

  elasticsearch
    .search({
      index: "users",
      type: "user",
      q
    })
    .then(body => {
      const results = body.hits.hits.map(user => {
        const { first_name, last_name, location } = user._source as any;
        return {
          id: user._id,
          full_name: `${first_name} ${last_name}`,
          location
        };
      });
      console.log(results);

      res.render("users", { results });
    })
    .catch(err => {
      res.send(err);
    });
});

router.get("/:userId", (req, res, next) => {
  elasticsearch
    .get({
      index: "users",
      type: "user",
      id: req.params.userId
    })
    .then(body => {
      const friend = (body._source as any).first_name;
      res.render("friend", { friend });
    })
    .catch(err => {
      res.send(err);
    });
});

export default router;
