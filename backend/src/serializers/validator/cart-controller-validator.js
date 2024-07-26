/**
 * @module cart-controller-validator
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
 * Validates if the cartId is not null
 * @type {Array} - The validation array.
 */

export const cartValidator = [
                              body("quantity").notEmpty().withMessage("quantity is required").isNumeric().withMessage("quantity must be a number"),
                              body("product_id").notEmpty().withMessage("product_id is required").isNumeric().withMessage("product_id must be a number"),
                              
                              errorValidator];

/**
 * Validates if the cartId is not null
 * @type {Array} - The validation array.
 */

export const cartIdValidator = [param("cart_id").notEmpty().withMessage("cart_id is required"), isNumericInt("cart_id"), errorValidator];

/**
 * get all cart validator
 */

export const listCartsValidator = [
    query("skip").optional().isNumeric().withMessage("skip needs to be a number"),
    query("limit").optional().isNumeric().withMessage("limit needs to be a number"),
    parseSkipLimit,
    errorValidator
];