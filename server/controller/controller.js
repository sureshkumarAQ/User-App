const { User, userPhoto } = require("../models/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.SignUp = async (req, res) => {
  //Validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty" });
    return;
  }

  // Store all data in user object
  const user = await new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // zwt create a new tokken
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  //save user token
  user.token = token;

  // Save user in the database
  await user
    .save(user)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating a a new account",
      });
    });
};

// Login user
exports.Login = async (req, res) => {
  //get user data
  try {
    //Validate request
    if (!req.body) {
      res.status(400).send({ message: "Fill email and password" });
      return;
    }

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password)
      return res.status(406).send({ err: "Not all field have been entered" });

    // Check if user is already exist or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(406).send({ err: "No account with this email" });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(406).send({ err: "Invalid Credentials" });

    // zwt create a new tokken
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    //save user token
    user.token = token;

    //We can store in cookie also
    // res.cookie("jwtoken", token, {
    //   expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    //   httpOnly: true,
    // });

    res.send({ token });
  } catch (err) {
    res.status(500).send("Error while Login");
  }
};
