const router = require("express").Router();
const { User, Conversation, Message, Participant } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");
const { formatConversation } = require("./helper");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const getConvoIds = await Participant.findAll({
      where: userId,
      attributes: ["conversationId"],
      group: ["conversationId"],
    });

    const conversationIds = getConvoIds.map(
      (convo) => convo.dataValues.conversationId
    );

    const conversations = await Conversation.findAll({
      where: {
        id: {
          [Op.or]: conversationIds,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message },
        {
          model: User,
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      conversations[i] = formatConversation(convoJSON, req.user.id);
    }

    const sortedConversations = conversations.sort((a, b) => {
      const aLastIndex = a.messages.length - 1;
      const bLastIndex = b.messages.length - 1;

      const aLastCreated = a.messages[aLastIndex].createdAt;
      const bLastCreated = b.messages[bLastIndex].createdAt;

      return aLastCreated < bLastCreated ? 1 : -1;
    });

    res.json(sortedConversations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
