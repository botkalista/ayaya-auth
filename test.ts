import * as express from 'express';

import { registerRoutes, authMiddleware, disconnect } from './src/index';

async function setupServer() {
    const app = express();

    await registerRoutes(app, '/account', {
        connectionString: 'mongodb://admin:cameriera@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false',
        jwtKey: 'test',
        dbName: 'AyayaAuth',
        userCollection: 'Users',
        userModel: {
            test: 123
        },
        routes: {
            login: '/login',
            registration: '/create'
        }
    });
    
    app.get('/test', authMiddleware, (req, res) => {
        res.json({ asd: 123 });
    })

    return app;
}

const fetch = require('node-fetch');

function assert(expression, value) {
    if (expression == value) return;
    console.log('TEST ERROR: ', expression, value);
}

async function testing() {
    const server = (await setupServer()).listen(8030);
    const host = 'http://127.0.0.1:8030';

    const response_test_no_auth = await fetch(`${host}/test`);
    assert(response_test_no_auth.status, 401);

    const response_create_account = await fetch(`${host}/account/create`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            username: 'test',
            password: 'test'
        })
    });

    const response_create_account_data = await response_create_account.json();

    assert(response_create_account.status, 200);
    assert(response_create_account_data, 200);

    server.close();
    disconnect({ force: true });
    console.log('TEST FINISHED');
}


testing();