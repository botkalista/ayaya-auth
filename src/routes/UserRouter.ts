
import { Router, json, Request as expressRequest, Response as expressResponse } from 'express';
import { UserRepository, UserRepositoryConfig } from '../repositories/UserRepo';

const UserRouter = Router();
UserRouter.use(json());

let repo: UserRepository;

export async function createRouter(config: UserRepositoryConfig) {
    repo = new UserRepository(config);
    await repo.init();
    return UserRouter;
}

export async function needAuthentication(req: expressRequest, res: expressResponse, next) {
    const { authorization } = req.headers;

    if (!authorization) return res.status(401).json({ error: 'No auth' });

    const token = authorization.replace('Bearer ', '');

    const data = repo.verifyToken(token);

    if (!data) return res.status(401).json({ error: 'Invalid token' });

    const user = await repo.getUserByUid(data.uid);

    if (!user) return res.status(401).json({ error: 'Auth error' });

    res.locals.user = user;

    next();
}


UserRouter.post('/create', async (req, res) => {

    const { username, password, email } = req.body;

    const creation = await repo.createUser(username, password, email);
    if (creation) return res.status(400).json({ error: creation });

    res.status(200).json({ ok: true });

});

UserRouter.post('/login', async (req, res) => {

    const { username, password } = req.body;

    const token = await repo.loginUser(username, password);

    if (!token) return res.status(400).json({ error: 'Login error' });

    res.status(200).json({ token });

});
