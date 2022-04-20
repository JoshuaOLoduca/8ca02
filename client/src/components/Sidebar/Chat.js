import React from 'react';
import { Box } from '@material-ui/core';
import { BadgeAvatar, ChatContent } from '../Sidebar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    borderRadius: 8,
    height: 80,
    boxShadow: '0 2px 10px 0 rgba(88,133,196,0.05)',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'grab',
    },
  },
  unreadMessages: {
    position: 'absolute',
    right: 0,
    borderRadius: '500px',
    backgroundColor: 'rgb(81, 145, 254)',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '4px 8px',
    minWidth: '30px',
    textAlign: 'center',
    margin: 'auto',
    marginRight: 20,
  },
}));

const Chat = ({ conversation, setActiveChat }) => {
  const classes = useStyles();
  const { otherUser } = conversation;
  const unreadMessages = conversation.unreadMessageCount;

  const handleClick = async (conversation) => {
    await setActiveChat(conversation.otherUser.username);
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent
        conversation={conversation}
        unreadMessages={unreadMessages}
      />
      {!!unreadMessages && (
        <Box className={classes.unreadMessages}>{unreadMessages}</Box>
      )}
    </Box>
  );
};

export default Chat;
