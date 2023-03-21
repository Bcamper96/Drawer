const router = require("express").Router();
const { User, Image } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    const publicImageSearchResults = (await Image.findAll({
      where: { is_public: true },
      include: User
    })).map(imageObj => {return {dataValues: imageObj.dataValues, user: imageObj.user.dataValues}})
    const publicImages = publicImageSearchResults.slice(-5).reverse();

    res.render("homepage", {
      loggedIn: req.session.loggedIn,
      userData: req.body.userData,
      publicImages: publicImages
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/draw", withAuth, (req, res) => {
  try {
    res.render("canvas", {
      loggedIn: req.session.loggedIn,
      userData: req.body.userData,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/profile", withAuth, async (req, res) => {
  try {
    res.redirect(`/profile/${req.session.userId}`);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/profile/:userId", withAuth, async (req, res) => {
  try {
    const requirements = {user_id: req.params.userId}
    if (req.params.userId!=req.session.userId) requirements.is_public = true
    const userImages = await Image.findAll({ where: requirements })
    console.log(userImages)
    res.render("profile", {
      loggedIn: req.session.loggedIn,
      userData: req.body.userData,
      userImages: userImages
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/images/:imageId", withAuth, async (req, res) => {
  try {
    const id = req.params.imageId;
    const image = await Image.findByPk(id, {include: User});
    res.render("image", {
      loggedIn: req.session.loggedIn,
      userData: req.body.userData,
      image: image.dataValues,
      author: image.user.dataValues
    });
  } catch (err) {
    res.status(500).json(err);
    console.log(err)
  }
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

module.exports = router;
