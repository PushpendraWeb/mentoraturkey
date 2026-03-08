
const env = {
  mongoUri: 'mongodb+srv://RaftLabs_db_user:00HtFXy1smVpbN4N@raftlabs.vejlduu.mongodb.net/?appName=RaftLabs',
  port: 2000,
  jwtSecret: 'mentora-jwt-secret-change-in-production',
  jwtExpiresIn: '7d',
  openaiApiKey: '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' ,
  llmMaxTextLength: 10000,
};

module.exports = env;
