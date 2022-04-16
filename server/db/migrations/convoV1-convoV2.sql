CREATE TABLE participants (
  "conversationId" INT REFERENCES conversations(id),
  "userId" INT REFERENCES users(id),
  PRIMARY KEY ("conversationId", "userId")
) ;

-- For user1Id
INSERT INTO participants ("conversationId","userId")
  SELECT
    c.id as "conversationId", c."user1Id" as "userId"
  FROM
    conversations c;

-- user2Id
INSERT INTO participants ("conversationId","userId")
  SELECT
    c.id as "conversationId", c."user2Id" as "userId"
  FROM
    conversations c;

ALTER TABLE conversations
  DROP COLUMN IF EXISTS "user1Id",
  DROP COLUMN IF EXISTS "user2Id";