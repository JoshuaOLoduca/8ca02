const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op, Sequelize } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // Get latest read message ID
      convoJSON.mostRecentReadMessageId = (
        await Message.findOne({
          where: {
            read: true,
            senderId: userId,
            conversationId: convoJSON.id,
          },
          order: [["createdAt", "DESC"]],
        })
      )?.id;

      // Count unread messages
      convoJSON.unreadMessageCount = await Message.count({
        col: "read",
        where: {
          read: false,
          senderId: { [Op.not]: userId },
          conversationId: convoJSON.id,
        },
      });

      // set properties for notification count and latest message preview
      const lastMsgIndex = convoJSON.messages.length - 1;
      convoJSON.latestMessageText = convoJSON.messages[lastMsgIndex].text;
      conversations[i] = convoJSON;
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
