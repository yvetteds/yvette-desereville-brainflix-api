import express from "express";
import fs from "fs";
import uniqid from "uniqid";

const router = express.Router();

// a function to read the videos.json data file (to use in GET the requests below)
const readAllVideos = () => {
  const videosFile = fs.readFileSync("./data/videos.json");
  const allVideos = JSON.parse(videosFile);
  return allVideos;
};

// a function to write to our json file (for use in a POST request)
const writeVideos = (data) => {
  const stringifiedData = JSON.stringify(data);
  fs.writeFileSync("./data/videos.json", stringifiedData);
};

router
  .route("/")
  .get((_req, res) => {
    try {
      const videosData = readAllVideos();
      // map over our JSON data (which is now an array of objects since we parsed it)
      const videosDataServed = videosData.map((video) => {
        // configure the specific data we want to respond with to the use that hits this endpoint
        // in this case, when they hit the endpoint, they should just get a JSON response that includes the id and title
        return {
          id: video.id,
          title: video.title,
          channel: video.channel,
          image: video.image,
        };
      });
      // respond, in JSON format, with the array returned from the map function above that hold objects in the form of {id: "some-idea", title: "some-title" etc}
      res.json(videosDataServed);
    } catch (error) {
      console.error("Error reading videos file", error);
      res.status(500).send("Internal Server Error");
    }
  })
  .post((req, res) => {
    try {
      const videosData = readAllVideos();

      const newVideo = {
        id: uniqid(),
        title: req.body.title || "Untitled Video",
        channel: "Eloise Plaza",
        image: "./public/images/Upload-video-preview.jpg",
        description: req.body.description || "Placeholder Description",
        views: "101,521",
        likes: "25,879",
        duration: "5:01",
        video: "",
        timestamp: Date.now(),
        comments: [
          {
            id: "35bba08b-1b51-4153-ba7e-6da76b5ec1b9",
            name: "Noah Duncan",
            comment: "Love to see it!",
            likes: 0,
            timestamp: 1691731062000,
          },
          {
            id: "091de676-61af-4ee6-90de-3a7a53af7521",
            name: "Terry Wong",
            comment: "Super informative. Thanks!",
            likes: 2,
            timestamp: 1691644662000,
          },
        ],
      };

      videosData.push(newVideo);

      // write the updated array to our JSON file to update the actual JSON data file
      writeVideos(videosData);

      // respond back the user with a 201 that verifies something new was created, and also with JSON that shows the new JSON object we created here and that was added
      res.status(201).json(newVideo);
    } catch (error) {
      res.status(500).send(`Couldn't add video: ${error}`);
    }
  });

// GET single video by id
router.route("/:id").get((req, res) => {
  try {
    const videos = readAllVideos();
    const id = req.params.id;
    const singleVideo = videos.find((video) => video.id === id);

    if (!singleVideo) {
      console.log("Video not found for ID: ", id);
      return res.status(404).send("Video not found");
    }
    res.json(singleVideo);
  } catch (error) {
    console.error("Error processing request for single video: ", id);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
