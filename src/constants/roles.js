// Role_id mapping (must match seeded roles)
const ROLE_ID = {
  PARENT: 1,
  STUDENT: 2,
  MENTOR: 3,
};

// Signup: only Parent and Mentor
const SIGNUP_ALLOWED_ROLES = [ROLE_ID.PARENT, ROLE_ID.MENTOR];
const SIGNUP_ALLOWED_ROLE_NAMES = ['Parent', 'Mentor'];
const ROLE_NAME_TO_ID = { Parent: ROLE_ID.PARENT, Mentor: ROLE_ID.MENTOR };

module.exports = {
  ROLE_ID,
  SIGNUP_ALLOWED_ROLES,
  SIGNUP_ALLOWED_ROLE_NAMES,
  ROLE_NAME_TO_ID,
};
