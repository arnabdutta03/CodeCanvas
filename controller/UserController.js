const { response } = require("express");
const user = require("../model/UserData");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.UserLogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    const isUserExist = await user.findOne({ email });

    if (!isUserExist) {
      return res.redirect("/login?error=Account not found");
    }

    const isPasswordMatch = await bcrypt.compare(password, isUserExist.password);

    if (!isPasswordMatch) {
      return res.redirect("/login?error=Incorrect password");
    }

    // Generate JWT token that expires in 2 minutes
    const token = jwt.sign({ data: isUserExist._id }, process.env.JWT_SECRET, { expiresIn: '30s' });

    // Redirect with token in URL
    return res.redirect(`/blogs?token=${token}`);

  } catch (error) {
    return res.redirect("/login?error=Internal server error");
  }
};

exports.jwtverify = async (req, res, next) => {
  try {
    const token = req.query.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: "User not logged in" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
      if (err) {
        return res.send("/login?error=Session expires! Please Login again");
      }

      req.user = decoded.data;
      next(); // Move to the next middleware or route handler
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.UserRegister = async (req, res) => {
  try {

    if (!req.body) {
      return res.redirect("/login?error=Account not found");
    }

    let userdata = req.body;

    // Check if user already exists
    const isEmail = await user.findOne({ email: userdata.email });
    const isUsername = await user.findOne({ username: userdata.username });
    const isPhone = await user.findOne({ phone: userdata.phone });

    if (isEmail) {
      return res.redirect("/register?error=Email already exists");
    }
    if (isUsername) {
      return res.redirect("/register?error=Username already exists");
    }
    if (isPhone) {
      return res.redirect("/register?error=Phone Number already exists");
    }

    // Hash the password using bcrypt
    const hash = await bcrypt.hash(userdata.password, parseInt(process.env.SALT));

    // Prepare the object to store in the database
    let ObjCreate = {
      ...userdata,
      password: hash,
    };

    // Insert user into the database
    const createData = await user.create(ObjCreate);

    if (createData) {
      return res.redirect("/register?success=Account successfully created");
    } else {
      return res.status(500).send({ message: "Database insert error" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: 500,
      message: "Internal server error",
      err: error.message,
    });
  }
};