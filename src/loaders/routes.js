import userModule from '../components/user/user.module.js';
import sessionModule from '../components/session/session.module.js';
//import todoModule from '../components/todo/todo.module.js';

export default (app) => {
  app.use('/users', userModule.router);
  app.use('/session', sessionModule.router);
  //app.use('/todos', todoModule.router);
};
