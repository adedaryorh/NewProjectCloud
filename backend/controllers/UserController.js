require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const EmailService = require("../service/emailService");

exports.getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.status(200).send({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({
      success: false,
      message: "Server Error",
      data: error.message,
    });
  }
};

exports.registerUser = async (req, res, next) => {

  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({
        status: false,
        message: "This email already exists"
      });
    }
    const hashPwd = bcrypt.hashSync(password, 10);

    const request = {
      name,
      email,
      password: hashPwd,
      token: ''
    }

    const savedUser = await User.create(request);
    if (savedUser) {
      const token = this.generateCode();
      const result = await User.updateOne({ email }, { $set: { token } });
      const message = `Use The token to verify your Account.\n ${token}`
      await EmailService.sendMail(email, message, "Verify Account")
    }

    return res.status(201).send({
      status: true,
      message: "Registration successful"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      message: "Server Error"
    })
  }
}

exports.loginUser = async (req, res, next) => {

  try {
    const { email, password } = req.body
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({
        status: false,
        message: "User not found"
      })
    } else {
      if (!user.isActivated) {
        return res.status(400).send({
          status: false,
          message: "Account not activated: Check your email for activation token"
        });
      } else {
        const compare = bcrypt.compareSync(password, user.password);
        if (!compare) {
          return res.status(400).send({
            status: false,
            message: "Invalid Password"
          })
        } else {
          const payload = {
            user: {
              id: user.id,
            },
          };
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 });
          return res.status(200).send({
            status: true,
            token,
            user
          })
        }
      }
    }
  } catch (error) {

    return res.status(500).send({
      status: false,
      message: "Server Error"
    })
  }
}

exports.generateCode = () => Math.floor(Math.random() * 900000) + 100000;

exports.resendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "No User found with this email"
      });
    }

    const token = this.generateCode();
    await User.updateOne({ email }, { $set: { token } });
    const message = `Use The token to verify your Account.\n ${token}`;
    const subject = "Account Verification";
    await EmailService.sendMail(email, message, subject);
    return res.status(200).send({
      status: true,
      message: "Token Sent check email or mobile number"
    });

  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Server Error"
    });
  }
}

exports.verifyUser = async (req, res) => {
  try {
    const { email, token } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "No User found with this email"
      });
    }
    const userToken = user.token;
    if (token !== userToken) {
      return res.status(400).send({
        status: false,
        message: "Invalid Code"
      });
    }
    await User.updateOne({ email }, { $set: { isActivated: true } });
    return res.status(200).send({
      status: true,
      message: "Account Activated Successfully"
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Server Error"
    });
  }
}

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(500).send({
        status: false,
        message: "Passwords do not match"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "No User found with this email"
      });
    }

    let currentPassword = bcrypt.hashSync(password, 10);
    await User.updateOne({ email }, { $set: { password: currentPassword } });
    return res.status(200).send({
      status: true,
      message: "Password Changed Successfully",
    });

  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Server Error"
    })
  }
};