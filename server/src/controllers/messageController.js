const prisma = require("../config/prisma");

const sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    const message = await prisma.message.create({
      data: {
        content,
        senderId: req.user.id,
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    const io = req.app.get("io");
    io.emit("newMessage", message);
    res.status(201).json(message);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        conversationId: Number(conversationId),
      },

      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(messages);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const markMessagesSeen = async (req, res) => {
  try {
    const conversationId = Number(req.params.conversationId);

    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: {
          not: req.user.id,
        },
        seen: false,
      },
      data: {
        seen: true,
      },
    });
    const io = req.app.get("io");

    io.emit("messagesSeen", {
      conversationId,
    });

    res.json({
      message: "Messages marked as seen",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markMessagesSeen,
};
