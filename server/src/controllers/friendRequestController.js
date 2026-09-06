const prisma = require("../config/prisma");

const sendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            senderId: req.user.id,
            receiverId,
          },
          {
            senderId: receiverId,
            receiverId: req.user.id,
          },
        ],
        status: {
          in: ["pending", "accepted"],
        },
      },
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already exists",
      });
    }
    const request = await prisma.friendRequest.create({
      data: {
        senderId: req.user.id,
        receiverId,
      },
    });

    res.status(201).json(request);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const getRequests = async (req, res) => {
  try {
    const requests = await prisma.friendRequest.findMany({
      where: {
        receiverId: req.user.id,
        status: "pending",
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

    res.json(requests);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
const rejectRequest = async (req, res) => {
  try {
    const requestId = Number(req.params.id);

    await prisma.friendRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: "rejected",
      },
    });

    res.json({
      message: "Request rejected",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
const acceptRequest = async (req, res) => {
  try {
    const requestId = Number(req.params.id);

    const request = await prisma.friendRequest.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    // Update request status
    await prisma.friendRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: "accepted",
      },
    });

    // Check if conversation already exists between both users
    const conversations = await prisma.conversation.findMany({
      include: {
        participants: true,
      },
    });

    const existingConversation = conversations.find((conversation) => {
      const userIds = conversation.participants.map(
        (participant) => participant.userId,
      );

      return (
        userIds.includes(request.senderId) &&
        userIds.includes(request.receiverId)
      );
    });

    if (existingConversation) {
      return res.status(400).json({
        message: "Conversation already exists",
      });
    }

    // Create conversation
    const conversation = await prisma.conversation.create({
      data: {},
    });

    await prisma.conversationParticipant.createMany({
      data: [
        {
          userId: request.senderId,
          conversationId: conversation.id,
        },
        {
          userId: request.receiverId,
          conversationId: conversation.id,
        },
      ],
    });

    res.json({
      message: "Request accepted",
      conversation,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  sendRequest,
  getRequests,
  acceptRequest,
  rejectRequest,
};
