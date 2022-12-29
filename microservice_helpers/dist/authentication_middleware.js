"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInformation = exports.UserInformation = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Middleware function which can be used to secure endpoints needing authentication.
 * Note that the JWT_SECRET_KEY environment variable must be set.
 */
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            throw new Error();
        }
        const decoded = jsonwebtoken_1.default.verify(token, (_b = process.env.JWT_SECRET_KEY) !== null && _b !== void 0 ? _b : "");
        req.user = new UserInformation(decoded._id, decoded.name, decoded.email, decoded.cashbookId);
        next();
    }
    catch (err) {
        res.status(403).send({
            successful: false,
            error: "Please authenticate"
        });
    }
});
exports.auth = auth;
class UserInformation {
    constructor(id, name, email, cashbookId) {
        this._id = id;
        this.name = name;
        this.email = email;
        this.cashbookId = cashbookId;
    }
}
exports.UserInformation = UserInformation;
function getUserInformation(req) {
    var _a;
    if (req.hasOwnProperty("user")) {
        return (_a = req.user) !== null && _a !== void 0 ? _a : null;
    }
    else {
        return null;
    }
}
exports.getUserInformation = getUserInformation;
