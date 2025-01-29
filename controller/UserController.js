const { response } = require("express");
const user = require("../model/UserData");
require("dotenv").config();
const bcrypt = require("bcrypt");


exports.UserRegister = async (request, response) => {
  try {

    if (!request.body) {
      return response.status(400).send({ message: "Request body is missing" });
    }

    let userdata = request.body;
    console.log("User Data:", userdata);

    // Check if user already exists
    const isEmail = await user.findOne({ email: userdata.email });
    const isUsername = await user.findOne({ username: userdata.username });
    const isPhone = await user.findOne({ phone: userdata.phone });

    if (isEmail || isUsername || isPhone) {
      return response.status(400).send({ message: "User already exists" });
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
      return response.status(201).redirect('/');
    } else {
      return response.status(500).send({ message: "Database insert error" });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return response.status(500).send({
      status: 500,
      message: "Internal server error",
      err: error.message,
    });
  }
};

exports.UserLogin = async (req, res) => {
  try {
    let userdata = req.body;
    const isUserExist = await user.findOne({ email: userdata.email });

    if (!isUserExist) {
      return res.redirect("/login?error=Invalid login details");
    }

    bcrypt.compare(userdata.password, isUserExist.password, async function (err, result) {
      if (err) {
        return res.redirect("/login?error=Internal server error");
      }

      if (result) {
        return res.status(201).json({ redirect: "/blogs" });
      } else {
        return res.redirect("/login?error=Invalid login details");
      }
    });
  } catch (error) {
    res.redirect("/login?error=Internal server error");
  }
};
