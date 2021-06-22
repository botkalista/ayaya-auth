
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

export async function disconnect(options: { force: boolean } = { force: false }) {
    if (options.force) {
        for (let i = 0; i < 5; i++) {
            await new Promise(r => setTimeout(r, 1000));
            if (client && client.isConnected()) return await client.close();
        }
    } else {
        if (!client) return;
        if (client.isConnected()) await client.close();
    }
}

export async function registerRoutes(app, path, config: AuthConfig) {
    await init(config);
    const router = await createRouter(userRepo, config);
    app.use(path, router);
    return { router, usersCollection, client };
}

export const authMiddleware = needAuthentication;
