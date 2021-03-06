const { User, userProfile } = require("../models/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
  );
};

exports.SignUp = async (req, res) => {
  //Validate request
  if (!req.body) {
    res.status(501).send({ message: "Content can not be empty" });
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
      res.status(501).send({ message: "Fill email and password" });
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

// Upload your profile photo
exports.uploadProfilePhoto = async (req, res) => {
  try {
    const userID = req.user._id;

    // Check if already uploaded or not

    const profile = await userProfile.find({ user: userID });
    // console.log(profile.length);

    if (profile.length !== 0) {
      res.status(200).send("Sorry you already uploaded your profile photo");
    } else {
      // console.log(`Your file is :${req.file}`);
      const photo = await new userProfile({
        profilePhoto: req.file,
        user: userID,
      });

      await photo.save(photo).then((data) => {
        res.status(201).send(data);
      });
    }
  } catch (error) {
    res.status(501).send(error.message);
  }
};

exports.allUsers = async (req, res) => {
  try {
    const users = await userProfile
      .find()
      .select("-__v -_id")
      .populate("user", ["name", "email", "_id"]);
    res.status(201).send(users);
  } catch (error) {
    res.status(501).send(error.message);
  }
};

exports.editUserProfile = async (req, res) => {
  try {
    const userID = req.user._id;

    let newName, newEmail, newPassword;
    if (req.body.name) {
      newName = req.body.name;
    }
    if (req.body.email) {
      newEmail = req.body.email;
    }
    if (req.body.password) {
      newPassword = req.body.password;
      // Hash password before updateting
      const salt = await bcrypt.genSalt();
      let hashedPassword = newPassword.toString();
      newPassword = await bcrypt.hash(hashedPassword, salt);
    }

    await User.findByIdAndUpdate(userID, {
      name: newName,
      email: newEmail,
      password: newPassword,
    });

    const updatedUser = await User.findById({ _id: userID });
    res.status(201).send(updatedUser);
  } catch (error) {
    res.status(501).send(error.message);
  }
};
