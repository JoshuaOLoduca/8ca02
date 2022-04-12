import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: 'bold',
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: '#9CADC8',
    letterSpacing: -0.17,
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
  },
}));

const ChatContent = ({ conversation, unreadMessages }) => {
  const classes = useStyles();

  const { otherUser } = conversation;
  const latestMessageText = conversation.id && conversation.latestMessageText;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      {!!unreadMessages && (
        <Box className={classes.unreadMessages}>{unreadMessages}</Box>
      )}
    </Box>
  );
};

export default ChatContent;
