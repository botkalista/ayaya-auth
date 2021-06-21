"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.UserRepository = void 0;
var jwt = require("jsonwebtoken");
var uuid = require("uuid");
var UserRepository = /** @class */ (function () {
    function UserRepository(collection, config) {
        this.collection = collection;
        this.config = config;
    }
    UserRepository.prototype.validateCreateUser = function (username, password, email) {
        if (!username || username.length == 0)
            return 'Username required';
        if (!password || password.length == 0)
            return 'Password required';
        if (!email || email.length == 0)
            return 'Email required';
        if (username.length < 6)
            return 'Username too short';
        if (username.length > 20)
            return 'Username too long';
        if (password.length < 6)
            return 'Password too short';
        if (password.length > 50)
            return 'Password too long';
        if (!email.match(/.*@.*\..*/))
            return 'Email invalid';
    };
    UserRepository.prototype.checkDuplicateUser = function (username, email) {
        return __awaiter(this, void 0, void 0, function () {
            var usernameDuplicate, emailDuplicate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.findOne({ username: username })];
                    case 1:
                        usernameDuplicate = _a.sent();
                        if (usernameDuplicate)
                            return [2 /*return*/, 'Username already exist'];
                        return [4 /*yield*/, this.collection.findOne({ email: email })];
                    case 2:
                        emailDuplicate = _a.sent();
                        if (emailDuplicate)
                            return [2 /*return*/, 'Email already exist'];
                        return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.createUser = function (username, password, email) {
        return __awaiter(this, void 0, void 0, function () {
            var validation, duplication;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validation = this.validateCreateUser(username, password, email);
                        if (validation)
                            return [2 /*return*/, validation];
                        return [4 /*yield*/, this.checkDuplicateUser(username, email)];
                    case 1:
                        duplication = _a.sent();
                        if (duplication)
                            return [2 /*return*/, duplication];
                        return [4 /*yield*/, this.collection.insertOne(__assign({ uid: uuid.v4(), username: username,
                                password: password,
                                email: email, emailVerified: false, creationTime: new Date().getTime() }, this.config.userModel))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.loginUser = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, objectToSign, signSecret, signOptions, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!username || !password)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.collection.findOne({
                                username: username, password: password
                            })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/];
                        objectToSign = { uid: user.uid };
                        signSecret = this.config.jwtKey;
                        signOptions = {
                            expiresIn: '1h'
                        };
                        token = jwt.sign(objectToSign, signSecret, signOptions);
                        return [2 /*return*/, token];
                }
            });
        });
    };
    UserRepository.prototype.getUserByUid = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!uid)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.collection.findOne({
                                uid: uid
                            })];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UserRepository.prototype.verifyToken = function (token) {
        try {
            var data = jwt.verify(token, this.config.jwtKey);
            return data;
        }
        catch (ex) {
            return;
        }
    };
    return UserRepository;
}());
exports.UserRepository = UserRepository;
