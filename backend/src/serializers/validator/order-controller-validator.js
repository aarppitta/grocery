/**
 * @module order-controller-validator
 */

import { body, param, query } from "express-validator";
import errorValidator, { parseSkipLimit } from "./validator.js";

/**
 * Validates if a given field is a numeric integer.
 * @param {string} field - The field to validate.
 * @returns {object} - The validation object.
 */


/**
 * Validates if a given field is a numeric integer greater than or equal to 1.
 * @param {string} field - The name of the field being validated.
 * @returns {Function} A function that performs the validation.
 */

const isNumericInt = (field) =>
    param(field).custom((value) => {
        if (value.toString().includes(".")) {
        throw new Error(`${field} must not be a decimal or float`);
        }
        if (!Number.isInteger(Number(value))) {
        throw new Error(`${field} must be an integer`);
        }
        if (Number(value) < 1) {
        throw new Error(`${field} must be greater than or equal to 1`);
        }
        return true;
    });

/**
 * Validates if the orderId is not null and is a numeric integer.
 * @type {Array} - The validation array.
 */

export const orderValidator = [body("totalPrice").notEmpty().withMessage("totalPrice is required").withMessage("totalPrice must be a number"),
                                body("user_id").notEmpty().withMessage("user_id is required").withMessage("user_id must not be a number"),
                                errorValidator];


/**
 * Validates if the orderId is not null and is a numeric integer.
 * @type {Array} - The validation array.
 */
export const orderIdValidator = [param("orderId").notEmpty().withMessage("order id is required"), isNumericInt("orderId"), errorValidator];

/**
 *  get all order validator
 */

export const listOrdersValidator = [
    query("skip").optional().isNumeric().withMessage("skip needs to be a number"),
    query("limit").optional().isNumeric().withMessage("limit needs to be a number"),
    query("search_key").optional().isString().withMessage("search_key needs to be a string"),
    parseSkipLimit,
    errorValidator,
];