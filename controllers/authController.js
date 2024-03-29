const User = require("../models/user");

const bcrypt = require("bcryptjs");

const customError = require("../utils/customError");

const jwt = require("jsonwebtoken");

//register
const register = async (req, res, next) => {
  console.log(req.body);
  const { email, password, repeatPassword } = req.body;
  if (!email) {
    return next(customError("Please Provide an email", 400));
  }

  if (!password) {
    return next(customError("Please provide a password", 400));
  }

  if (password !== repeatPassword) {
    return next(customError("Password Missmatch", 400));
  }

  // ======================

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  // ======================

  try {
    const user = await User.create({ email, password: hashedPassword });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    return res.status(200).json({
      id: user._id,
      token,
    });
  } catch (error) {
    if (error.code === 11000 && error.keyValue.email) {
      return next(customError("This email already exists", 400));
    }

    if (error.errors.email.message) {
      return next(customError(error.errors.email.message, 400));
    }

    next(customError("Something went wrong", 500));
  }
};

// ========================================================================

//login
const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(customError("Please Provide your email", 400));
  }

  if (!password) {
    return next(customError("Please Provide your password", 400));
  }

  //=====================
  const user = await User.findOne({ email });

  if (!user) {
    return next(customError("User does not exist", 400));
  }
  //=====================

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return next(customError("Wrong password", 400));
  }
  //=====================

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.status(200).json({
    token,
    id: user._id,
  });
};

//============================================================

const getUser = (req, res, next) => {
  const { userId } = req.user;
  res.status(200).json({
    id: userId,
  });
};

module.exports = { register, login, getUser };
