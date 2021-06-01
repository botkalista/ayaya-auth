import * as express from 'express';

import { registerRoutes, authMiddleware } from './ayaya-auth/src/index';

const app = express();

registerRoutes(app, '/account', {
    connectionString: 'mongodb://admin:cameriera@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false',
    jwtKey: 'test',
    dbName: 'AyayaAuth',
    userCollection: 'Users',
    userModel: {
        test: 123
    }
});

app.get('/test', authMiddleware, (req, res) => {
    res.json({ asd: 123 });
})

app.listen(8030);
