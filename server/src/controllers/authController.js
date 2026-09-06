const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword,
      },
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Protected Route Accessed",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
