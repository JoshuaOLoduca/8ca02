const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const Participant = require("./participant");

// associations
//
User.belongsToMany(Conversation, { through: Participant });
Participant.belongsTo(Message, {
  as: "lastMessageRead",
  constraints: false,
});
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message,
};
