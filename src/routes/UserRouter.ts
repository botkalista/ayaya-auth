
import { Router, json, Request as expressRequest, Response as expressResponse } from 'express';
import { UserRepository } from '../repositories/UserRepo';

import { AuthConfig } from '../types/AuthConfig'

const UserRouter = Router();
UserRouter.use(json());


let repo: UserRepository;
let conf: AuthConfig;

export async function createRouter(userRepo: UserRepository, config: AuthConfig) {
    conf = config;
    repo = userRepo;

    UserRouter.post(conf.routes.registration, async (req, res) => {

        const { username, password, email } = req.body;

        const creation = await repo.createUser(username, password, email);
        if (creation) return res.status(400).json({ error: creation });

        res.status(200).json({ ok: true });

    });

    UserRouter.post(conf.routes.login, async (req, res) => {

        const { username, password } = req.body;

        const token = await repo.loginUser(username, password);

        if (!token) return res.status(400).json({ error: 'Login error' });

        res.status(200).json({ token });

    });

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



