import express from 'express';
import authRoute from './auth.route.js';
import topicRoute from './topic.route.js';
import progressRoute from './progress.route.js';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/',
    route: authRoute,
  },
  {
    path: '/topics',
    route: topicRoute,
  },
  {
    path: '/progress',
    route: progressRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
