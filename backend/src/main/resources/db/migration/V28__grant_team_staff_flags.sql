-- V28: Ensure CodeQuest team emails have staff ops access when the account exists.

UPDATE users
SET is_staff = TRUE
WHERE lower(email) IN (
  'bsbhackman@gmail.com',
  'abdulsamedtaslima@gmail.com',
  'angelonwe54@gmail.com'
);
