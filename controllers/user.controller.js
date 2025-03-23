import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields Are Required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with respected Email Id",
      });
    }

    const hashPass = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashPass,
    });

    return res
      .status(201)
      .json({ success: true, message: "Account Created Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "failed to Register User",
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields Are Required" });
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Email Or Password" });
    }

    const isPass = await bcrypt.compare(password, userExists.password);

    if (!isPass) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Email Or Password" });
    }

    const token = jwt.sign(
      { userId: userExists._id, role: userExists.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60,
      })
      .json({
        success: true,
        message: `Welcome Back to CoursesHub ${userExists.name}`,
        user:userExists
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "failed to Login User",
    });
  }
};
