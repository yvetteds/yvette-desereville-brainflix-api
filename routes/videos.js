import express from "express";
import fs from "fs";

const router = express.Router();

// a function to read the videos.json data file (to use in GET the requests below)
const readAllVideos = () => {
  const videosFile = fs.readFileSync("../data/videos.json");
  const allVideos = JSON.parse(videosFile);
  return allVideos;
};

// a function to write to our json file (for use in a POST request)
const writeVideos = (data) => {
  const stringifiedData = JSON.stringify(data);
  fs.writeFileSync("../data/videos.json", stringifiedData);
};

router
  .route("/")
  .get((_req, res) => {
    res.json(getAllPlayers());
  })
  .post((req, res) => {
    try {
      const player = addPlayer(req.body);
      res.status(201).json(player);
    } catch (error) {
      res.status(500).send(`Couldn't add player: ${error}`);
    }
  });

router
  .route("/:id")
  .get((req, res) => {
    const player = getPlayerById(req.params.id);

    if (!player) {
      return res.sendStatus(404);
    }

    res.json(player);
  })
  .patch((req, res) => {
    try {
      const player = updatePlayer(req.body);
      res.json(player);
    } catch (error) {
      res.status(400).send(`Couldn't update player: ${error}`);
    }
  });

export default router;
