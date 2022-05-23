const express = require("express");
const route = express.Router();
const userAuth = require("../middleware/userAuth");
const { upload } = require("../middleware/upload");
const controller = require("../controller/controller");

route.post("/signup", controller.SignUp);
route.post("/login", controller.Login);
route.put("/editProfile", userAuth, controller.editUserProfile);
route.post(
  "/uploadProfile",
  userAuth,
  upload.single("profilePhoto"),
  controller.uploadProfilePhoto
);

route.get("/users", controller.allUsers);

module.exports = route;
