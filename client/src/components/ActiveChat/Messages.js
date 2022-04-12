import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';

const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  const [latestReadMessageId, setLatestReadMessageId] = useState(0);

  messages.forEach((message) => {
    if (
      message.senderId === userId &&
      message.read &&
      latestReadMessageId < message.id
    ) {
      setLatestReadMessageId(message.id);
    }
  });

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format('h:mm');
        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            isLatestRead={latestReadMessageId === message.id}
            otherUser={otherUser}
          />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
