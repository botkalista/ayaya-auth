import { MongoClient, Collection } from 'mongodb';

import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import { AuthConfig } from '../types/AuthConfig';

export class UserRepository {

    private collection: Collection;
    private config: AuthConfig;
    
    constructor(collection: Collection, config: AuthConfig) {
        this.collection = collection;
        this.config = config;
    }

    private validateCreateUser(username: string, password: string, email: string): string {
        if (!username || username.length == 0) return 'Username required';
        if (!password || password.length == 0) return 'Password required';
        if (!email || email.length == 0) return 'Email required';

        if (username.length < 6) return 'Username too short';
        if (username.length > 20) return 'Username too long';
        if (password.length < 6) return 'Password too short';
        if (password.length > 50) return 'Password too long';
        if (!email.match(/.*@.*\..*/)) return 'Email invalid';
    }

    private async checkDuplicateUser(username: string, email: string): Promise<string> {
        const usernameDuplicate = await this.collection.findOne({ username });
        if (usernameDuplicate) return 'Username already exist';
        const emailDuplicate = await this.collection.findOne({ email });
        if (emailDuplicate) return 'Email already exist';
    }


    async createUser(username: string, password: string, email: string): Promise<string> {
        const validation = this.validateCreateUser(username, password, email);
        if (validation) return validation;
        const duplication = await this.checkDuplicateUser(username, email);
        if (duplication) return duplication;

        await this.collection.insertOne({
            uid: uuid.v4(),
            username,
            password,
            email,
            emailVerified: false,
            creationTime: new Date().getTime(),
            ...this.config.userModel
        });

    }

    async loginUser(username: string, password: string): Promise<string> {
        if (!username || !password) return;

        const user = await this.collection.findOne({
            username, password
        });

        if (!user) return;


        const objectToSign = { uid: user.uid }

        const signSecret: jwt.Secret = this.config.jwtKey;

        const signOptions: jwt.SignOptions = {
            expiresIn: '1h'
        }

        const token = jwt.sign(objectToSign, signSecret, signOptions);

        return token;
    }

    async getUserByUid(uid: string) {
        if (!uid) return;

        const user = await this.collection.findOne({
            uid: uid
        });

        return user;
    }

    verifyToken(token: string): any {
        try {
            const data = jwt.verify(token, this.config.jwtKey);
            return data;
        } catch (ex) {
            return;
        }
    }

}
