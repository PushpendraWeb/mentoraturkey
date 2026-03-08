const userRoutes = require('./user/user.route.js');
const roleRoutes = require('./Role/role.route.js');
const authRoutes = require('./auth/auth.route.js');
const lessonRoutes = require('./lessons/lesson.route.js');
const joinLessonRoutes = require('./Join_lessons/join_lesson.route.js');
const llmRoutes = require('./llm/llm.route.js');

function routes(app) {
  app.use('/api/user', userRoutes);
  app.use('/api/role', roleRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/lessons', lessonRoutes);
  app.use('/api/join_lessons', joinLessonRoutes);
  app.use('/api/llm', llmRoutes);
  app.use('/llm', llmRoutes);
}

module.exports = routes;