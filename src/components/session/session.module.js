import SessionController from './session.controller.js';
import SessionService from './session.service.js';
import SessionRouter from './session.router.js';
import SessionRepository from './session.repository.js';
import UserService from '../user/user.service.js';

const sessionRepository = new SessionRepository();
const sessionService = new SessionService(sessionRepository, UserService);
const sessionController = new SessionController(sessionService);
const sessionRouter = new SessionRouter(sessionController);

export default {
  service: sessionService,
  controller: sessionController,
  router: sessionRouter.getRouter(),
  repository: sessionRepository,
};
