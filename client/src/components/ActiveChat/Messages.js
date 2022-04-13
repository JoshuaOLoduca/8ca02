import React from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  const messageComponents = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    let message = messages[i];
    const time = moment(message.createdAt).format('h:mm');

    messageComponents.push(
      message.senderId === userId ? (
        <SenderBubble key={message.id} text={message.text} time={time} />
      ) : (
        <OtherUserBubble
          key={message.id}
          text={message.text}
          time={time}
          otherUser={otherUser}
        />
      )
    );
  }

  return <Box>{messageComponents}</Box>;
};

export default Messages;
