const express = require("express");
const route = express.Router();
const userAuth = require("../middleware/userAuth");
const controller = require("../controller/controller");

route.post("/signup", controller.SignUp);
route.post("/login", controller.Login);

module.exports = route;
