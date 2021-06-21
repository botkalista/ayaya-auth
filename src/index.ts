
import { Collection, MongoClient } from 'mongodb';
import { UserRepository } from './repositories/UserRepo';
import { createRouter, needAuthentication } from './routes/UserRouter';
import { AuthConfig } from './types/AuthConfig';


let client: MongoClient;
let usersCollection: Collection;

let userRepo: UserRepository;

async function init(config: AuthConfig) {
    client = await new MongoClient(config.connectionString).connect();
    usersCollection = client.db(config.dbName).collection(config.userCollection);

    userRepo = new UserRepository(usersCollection, config);
}


export async function registerRoutes(app, path, config: AuthConfig) {
    init(config);
    const router = await createRouter(userRepo, config);
    app.use(path, router);
    return router;
}

export const authMiddleware = needAuthentication;

