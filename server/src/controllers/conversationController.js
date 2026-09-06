const prisma = require("../config/prisma");

const createConversation = async (req, res) => {
  try {
    const { participantId } = req.body;

    const conversation = await prisma.conversation.create({
      data: {},
    });

    await prisma.conversationParticipant.createMany({
      data: [
        {
          userId: req.user.id,
          conversationId: conversation.id,
        },
        {
          userId: participantId,
          conversationId: conversation.id,
        },
      ],
    });

    res.status(201).json({
      message: "Conversation created",
      conversation,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const getConversations = async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: req.user.id,
          },
        },
      },

      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res.json(conversations);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createConversation,
  getConversations,
};
