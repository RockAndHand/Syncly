const prisma = require("../config/prisma");

const searchUsers = async (req, res) => {
  try {
    const search = req.query.search || "";

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: search,
          mode: "insensitive",
        },
        NOT: {
          id: req.user.id,
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  searchUsers,
};
