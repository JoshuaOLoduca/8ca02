const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");
const User = require("./user");

const Conversation = db.define("conversation", {});

// find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      userId: {
        [Op.and]: [user1Id, user2Id],
      },
    },
    include: [{ model: User }],
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

Conversation.getConvosationWithAssociates = async function (convoId) {
  const conversation = await Conversation.findOne({
    where: {
      id: convoId,
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

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;
