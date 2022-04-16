const router = require("express").Router();
const { User, Conversation, Message, Participant } = require("../../db/models");
const { Op } = require("sequelize");
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
      where: userId,
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

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.users.length > 1) {
        convoJSON.otherUsers = {};
        convoJSON.userCount = convoJSON.users.length;

        convoJSON.users.forEach((user) => {
          // set property for online status of the other user
          user.online = onlineUsers.includes(user.id);

          if (user.id === userId) convoJSON.self = user;
          else convoJSON.otherUsers[user.id] = user;
        });

        delete convoJSON.users;
      }

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
