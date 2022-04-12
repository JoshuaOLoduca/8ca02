const router = require("express").Router();
const res = require("express/lib/response");
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

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
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.patch("/read", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const readerId = req.user.id;
    const { conversationId } = req.body;
    const messagesToUpdate = [];

    const conversation = await Conversation.getConversationMessages(
      conversationId
    );
    if (!conversation) return res.sendStatus(404);

    for (const message of conversation.messages) {
      if (message.dataValues.senderId === readerId || message.dataValues.read)
        continue;

      message.dataValues.read = true;
      message.dataValues.updatedAt = new Date();
      messagesToUpdate.push(message.dataValues);
    }

    Message.bulkCreate(messagesToUpdate, {
      updateOnDuplicate: ["read", "updatedAt"],
    });

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
