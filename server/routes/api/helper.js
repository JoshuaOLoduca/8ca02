const onlineUsers = require("../../onlineUsers");

function formatConversation(convo, userId) {
  // set a property "otherUser" so that frontend will have easier access
  if (convo.users.length > 1) {
    convo.otherUsers = {};
    convo.userCount = convo.users.length;

    convo.users.forEach((user) => {
      // set property for online status of the other user
      user.online = onlineUsers.includes(user.id);

      if (user.id === userId) convo.self = user;
      else convo.otherUsers[user.id] = user;
    });

    delete convo.users;
  }

  // set properties for notification count and latest message preview
  const lastMsgIndex = convo.messages.length - 1;
  convo.latestMessageText = convo.messages[lastMsgIndex].text;
  return convo;
}

module.exports = { formatConversation };
