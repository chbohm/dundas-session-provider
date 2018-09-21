"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const requestRetryModule = require("requestretry");
const url = require("url");
const INVALID_SESSION_ERROR = 'Dundas.BI.InvalidSessionException';
class DundasSessionProvider {
    constructor(dundasUrl, dundasAdmin, dundasAdminPassword, accounts, request) {
        this.dundasAdmin = dundasAdmin;
        this.request = request;
        this.sessionsMap = new Map();
        this.accountMap = new Map();
        this.promisedQueue = new PromisedQueue();
        dundasUrl = dundasUrl.charAt(dundasUrl.length - 1) === '/' ? dundasUrl.substring(0, dundasUrl.length - 1) : dundasUrl;
        let parsedUrl = url.parse(dundasUrl);
        this.dundasUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.path}`;
        accounts.forEach((account) => {
            account.deleteOtherSessions = false; // we ensure that we don't remove other middleware dundas sessions
            this.accountMap.set(account.accountName, account);
        });
        this.accountMap.set(dundasAdmin, {
            accountName: dundasAdmin,
            password: dundasAdminPassword,
            isWindowsLogOn: false,
            deleteOtherSessions: false
        });
        this.request = this.request || requestRetryModule;
    }
    getSessionId(accountName, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            if (accountName === this.dundasAdmin) {
                logger.error('It was requested a SessionId of an admin account. Throwing error as invalid account, since admin sessions can only be used internally', { DundasAccount: accountName });
                throw new Error('Invalid dundas account');
            }
            return this.promisedQueue.execute(`getSessionId(${accountName})`, this.getSessionIdInternal.bind(this), accountName, logger);
        });
    }
    getSessionIdStatusForAllAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            let keys = [];
            this.accountMap.forEach((account, key) => {
                keys.push(key);
            });
            let status = {};
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                try {
                    let sessionId = yield this.promisedQueue.execute(`getSessionId(${key})`, this.getSessionIdInternal.bind(this), key);
                    status[key] = {
                        status: 'OK',
                        sessionId: sessionId
                    };
                }
                catch (error) {
                    status[key] = {
                        status: 'error',
                        error: error
                    };
                }
            }
            return status;
        });
    }
    getDundasAccounts() {
        return this.accountMap;
    }
    getDundasAccount(accountName) {
        return this.accountMap.get(accountName);
    }
    getSessionIdInternal(accountName, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('Searching for Dundas SessionId', { DundasAccount: accountName });
            let sessionId = yield this.sessionsMap.get(accountName);
            if (yield this.isValid(sessionId, logger)) {
                logger.info('An existing and valid SessionId was found', { DundasAccount: accountName, SessionId: sessionId });
                return sessionId;
            }
            this.sessionsMap.delete(accountName);
            sessionId = yield this.getExistingSessionIdFromDundas(accountName, logger);
            if (sessionId) {
                this.sessionsMap.set(accountName, Promise.resolve(sessionId));
                return sessionId;
            }
            this.sessionsMap.set(accountName, this.createNewSessionFromDundas(accountName, logger));
            return this.sessionsMap.get(accountName);
        });
    }
    createNewSessionFromDundas(accountName, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            let account = this.accountMap.get(accountName);
            if (!account) {
                throw new Error(`No configuration found for dundas account: ${accountName}`);
            }
            const options = this.buildRequestOptions('POST', '/Api/LogOn', account);
            let stream = yield this.doRequest(options, logger);
            let response = {
                sessionId: stream.body.sessionId,
                message: stream.body.message,
                logOnFailureReason: stream.body.logOnFailureReason
            };
            if (response.sessionId === undefined) {
                let message = response.logOnFailureReason || 'Error retrieving SessionId from BI server';
                logger.error(message, { Response: response, AccountName: accountName });
                throw new Error(message);
            }
            logger.info('It was created a new Dundas SessionId associated to account.', { SessionData: response, AccountName: accountName });
            return response.sessionId;
        });
    }
    getExistingSessionIdFromDundas(accountName, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('Asking Dundas for a valid SessionId associated to the given account', { DundasAccount: accountName });
            logger.info('Creating new admin SessionId in order to retrieve session information from Dundas', { DundasAccount: this.dundasAdmin });
            let adminSessionId;
            try {
                adminSessionId = yield this.createNewSessionFromDundas(this.dundasAdmin, logger);
            }
            catch (error) {
                logger.error('Error while creating new admin session', { DundasAccount: this.dundasAdmin, Error: error });
                throw error;
            }
            let sessionDetails = yield this.getSessionDetailsFromDundas(adminSessionId, accountName, logger);
            try {
                yield this.removeSessionFromDundas(adminSessionId, logger);
            }
            catch (error) {
                logger.error('Error while removing admin session', { DundasAccount: this.dundasAdmin, SessionId: adminSessionId });
                // We are NOT rethrowing the error. Since we do have sessionDetails
            }
            if (sessionDetails) {
                logger.info('It was found a SessionId in Dundas for the given account', { DundasAccount: accountName, SessionId: sessionDetails.id });
                return sessionDetails.id;
            }
            logger.info('It was not found in Dundas any SessionId associated to the given account', { DundasAccount: accountName });
            return undefined;
        });
    }
    getSessionDetailsFromDundas(adminSessionId, accountName, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = {
                querySessionsOptions: {
                    filter: [
                        {
                            field: 'seatKind',
                            operator: 'Equals',
                            value: 'StandardUser'
                        },
                        {
                            field: 'IsSeatReserved',
                            operator: 'Equals',
                            value: false
                        }
                    ]
                }
            };
            const options = this.buildRequestOptions('POST', '/Api/Session/Query', body, { sessionId: adminSessionId });
            logger.debug('Requesting dundas session id', { Options: options, Account: accountName });
            let stream = yield this.doRequest(options, logger);
            let response = stream.body;
            let sessions = response.filter((sessionDetail) => {
                return sessionDetail.accountName === accountName;
            });
            if (sessions.length === 0) {
                return undefined;
            }
            return sessions[0];
        });
    }
    isValid(sessionId, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!sessionId) {
                return false;
            }
            const options = this.buildRequestOptions('GET', '/Api/Session/IsValid', undefined, { sessionId: sessionId });
            logger.debug('Validating session id', { Options: options, SessionId: sessionId });
            let stream = yield this.doRequest(options, logger);
            return stream.body.toLowerCase() === 'true';
        });
    }
    removeSessionFromDundas(sessionId, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = this.buildRequestOptions('DELETE', '/Api/Session/Current', undefined, { sessionId: sessionId });
            logger.debug('Removing session id', { Options: options, SessionId: sessionId });
            this.doRequest(options, logger);
        });
    }
    buildRequestOptions(method, path, json, qs) {
        let request = {
            method: method,
            url: `${this.dundasUrl}${path}`
        };
        if (json) {
            request.json = json;
        }
        if (qs) {
            request.qs = qs;
        }
        const baseRequestObj = {
            maxAttempts: 3,
            retryDelay: 1000,
            retryStrategy: this.retryStrategy.bind(this)
        };
        Object.assign(request, baseRequestObj);
        return request;
    }
    retryStrategy(err, response, body) {
        const isHTTPOrNetworkError = !!requestRetryModule.RetryStrategies.HTTPOrNetworkError(err, response);
        if (isHTTPOrNetworkError) {
            console.error('HTTP or Network Error. Trying to connect to Dundas server again.', { Url: this.dundasUrl });
        }
        return isHTTPOrNetworkError;
    }
    doRequest(options, logger, nRetries = 3) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.debug('Dundas request', { Endpoint: { HRef: options.url, Method: options.method }, Params: options.json });
            let response = yield this.request(options);
            logger.debug('Dundas response', { Response: response.body });
            this.checkResponse(response);
            return response;
        });
    }
    checkResponse(stream) {
        if (stream.statusCode !== 200) {
            if (stream.body && stream.body.ExceptionType === 'Dundas.BI.InvalidSessionException') {
                throw new Error('Dundas.BI.InvalidSessionException');
            }
            else {
                throw new Error('Bad dundas response ' + stream.body);
            }
        }
    }
}
exports.DundasSessionProvider = DundasSessionProvider;
/**
 * This class has a map of functions being called associated to a key.
 * If execute method is invoked with a an existing key, then instead of returning the Promise of the function execution we
 * just return the promise associated to the key.
 */
class PromisedQueue {
    constructor() {
        this.commandMap = new Map();
    }
    execute(key, theFunction, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = this.commandMap.get(key);
            if (promise) {
                return promise;
            }
            promise = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let result = yield theFunction(...args);
                    resolve(result);
                }
                catch (error) {
                    reject(error);
                }
                finally {
                    this.commandMap.delete(key);
                }
            }));
            this.commandMap.set(key, promise);
            return promise;
        });
    }
}
//# sourceMappingURL=dundasSessionProvider.js.map