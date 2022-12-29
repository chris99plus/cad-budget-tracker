"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiHandler = void 0;
/**
 * This function can be used to wrap api code. It automatically sends the correct
 * status code and response format.
 *
 * You can return error messages like so: throw "Error message"
 */
const apiHandler = (fn) => (req, res) => {
    fn(req, res)
        .then(data => res.send({
        successful: true,
        data: data
    }))
        .catch(err => {
        console.log(err);
        res.status(400).send({
            successful: false,
            message: err
        });
    });
};
exports.apiHandler = apiHandler;
