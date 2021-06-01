
import { UserRepositoryConfig } from './repositories/UserRepo';
import { createRouter, needAuthentication } from './routes/UserRouter';

export async function registerRoutes(app, path, config: UserRepositoryConfig) {
    const router = await createRouter(config);
    app.use(path, router);
    return router;
}

export const authMiddleware = needAuthentication;

