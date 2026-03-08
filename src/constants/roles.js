// Role_id mapping (must match seeded roles)
const ROLE_ID = {
  PARENT: 1,
  STUDENT: 2,
  MENTOR: 3,
};

const SIGNUP_ALLOWED_ROLES = [ROLE_ID.PARENT, ROLE_ID.MENTOR];

module.exports = { ROLE_ID, SIGNUP_ALLOWED_ROLES };
