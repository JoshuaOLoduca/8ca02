const router = require("express").Router();
const { Conversation, Message, Participant, User } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { formatConversation } = require("./helper");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;
    const users = [senderId, recipientId];

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create();
      const participants = users.map((userId) => {
        return { userId, conversationId: conversation.id };
      });

      Participant.bulkCreate(participants);
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }

      conversation.isNewRecord = true;
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });

    let convo;
    if (conversation.isNewRecord) {
      convo = formatConversation(
        await Conversation.getConvosationWithAssociates(conversation.id),
        req.user.id
      );
    }

    res.json({ message, sender, conversation: convo });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
