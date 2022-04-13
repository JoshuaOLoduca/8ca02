const { Op } = require("sequelize");
const db = require("../db");
const Participant = require("./participant");

const Group = db.define("group", {});

// find groups given user Id

Group.findGroups = async function (userId) {
  const groups = await Group.findAll({
    where: {
      userId,
    },
    include: [{ model: Participant, order: ["createdAt", "DESC"] }],
  });

  // return conversation or null if it doesn't exist
  return group;
};

module.exports = Group;
