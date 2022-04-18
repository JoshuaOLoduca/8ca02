import React from 'react';
import { Avatar, Box } from '@material-ui/core';
import { BadgeAvatar, ChatContent } from '../Sidebar';
import { makeStyles } from '@material-ui/core/styles';
import { AvatarGroup } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
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
}));

const Chat = ({ conversation, setActiveChat }) => {
  const classes = useStyles();
  const { otherUser, otherUsers } = conversation;

  const handleClick = async (conversation) => {
    await setActiveChat(conversation.otherUser.username);
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      {conversation.isGroupChat ? (
        <AvatarGroup max={3}>
          {Object.keys(otherUsers).map((user) => (
            <Avatar
              alt={otherUsers[user].username}
              src={otherUsers[user].photoUrl}
            />
          ))}
        </AvatarGroup>
      ) : (
        <BadgeAvatar
          photoUrl={otherUser.photoUrl}
          username={otherUser.username}
          online={otherUser.online}
          sidebar={true}
        />
      )}
      <ChatContent conversation={conversation} />
    </Box>
  );
};

export default Chat;
