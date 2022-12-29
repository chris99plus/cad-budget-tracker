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
exports.makeServiceCallPost = exports.makeServiceCallGet = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
/**
 * Execute a GET request to the given microservice.
 */
function makeServiceCallGet(serviceUrl, path) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield (0, node_fetch_1.default)(serviceUrl + path, {
            headers: { "Content-Type": "application/json" }
        });
        let responseJson = yield response.json();
        if (!responseJson.successful) {
            throw responseJson.message;
        }
        return responseJson.data;
    });
}
exports.makeServiceCallGet = makeServiceCallGet;
/**
 * Execute a POST request to the given microservice.
 */
function makeServiceCallPost(serviceUrl, path, body) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield (0, node_fetch_1.default)(serviceUrl + path, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        });
        let responseJson = yield response.json();
        if (!responseJson.successful) {
            throw responseJson.message;
        }
        return responseJson.data;
    });
}
exports.makeServiceCallPost = makeServiceCallPost;
