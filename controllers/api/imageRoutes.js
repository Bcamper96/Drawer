const router = require("express").Router();
const { Image } = require("../../models");

router.get("/public", async (req, res) => {
  try {
    const publicImages = await Image.findAll({ where: {is_public: true} });

    if (!publicImages[0]) {
      res.status(404).json({ message: "No public images found...?" });
      return
    }

    res.json(publicImages);
  } catch (err) {
    res.status(500).json(err);
    console.log(err)
  }
});

router.post("/save-as", async (req, res) => {
  try {
    const title = req.body.title;
    const snapshot = req.body.snapshot;
    const isPublic = req.body.isPublic;
    const userId = req.session.userId;

    if (!userId) {
      res.status(400).json({ message: "Must be logged in to upload image" });
      return;
    }

    const newImage = await Image.create({
      title: title,
      snapshot: snapshot,
      is_public: isPublic,
      user_id: userId,
    });

    const newId = newImage.dataValues.id;

    res.json({ id: newId });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/save-over", async (req, res) => {
  try {
    const id = req.body.id;
    const title = req.body.title;
    const snapshot = req.body.snapshot;
    const isPublic = req.body.isPublic;
    const userId = req.session.userId;

    if (!userId) {
      res.status(400).json({ message: "Must be logged in to upload image" });
      return;
    }

    const uploaderId = (await Image.findByPk(id)).dataValues.user_id;
    if (userId !== uploaderId) {
      res
        .status(400)
        .json({ message: "Image cannot be edited as current user" });
      return;
    }

    Image.update({
        title: title,
        snapshot: snapshot,
        is_public: isPublic,
        user_id: userId,
      },
      {
        where: { id: id },
      }
    );

    res.json({ id: id });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/download/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const image = await Image.findByPk(id);
    res.json(image);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
