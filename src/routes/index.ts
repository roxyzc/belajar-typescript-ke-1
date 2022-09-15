import { Router } from 'express';
import User from '../controllers/User.controller';
import Auth from '../controllers/Auth.controller';

const router: Router = Router();
const user = new User();
const auth = new Auth();

router.post('/api/register', auth.validateSchema(auth.schemas.Auth.register), user.register);
router.get('/api/register/:token', auth.checkValid(), user.verify);
router.post('/api/login', auth.validateSchema(auth.schemas.Auth.login), auth.login);
router.post('/api/refreshToken', auth.checkExpired(), user.refreshToken);
router.route('/api/user').get(auth.verifyToken(), user.get);
router.route('/api/user/:id').get(auth.verifyTokenAndAuthorization(), user.get);

export default router;
