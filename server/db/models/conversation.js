const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");
const Participant = require("./participant");

const Conversation = db.define("conversation", {});

// find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      userId: {
        [Op.or]: [user1Id, user2Id],
      },
    },
    include: [{ model: Participant }],
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;
