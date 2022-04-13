const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const Group = require("./group");
const Participant = require("./participant");

// associations

User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

// Group Chat
User.hasMany(Participant);
Participant.belongsTo(Group);
// Message.belongsTo(Group);
Group.hasMany(Message);
Group.hasMany(Participant);

module.exports = {
  User,
  Conversation,
  Message,
};
