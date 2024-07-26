/**
 * This module exports several validators for the address controller.
 * @module cartItem-controller-validator
 */


import { body, param, query } from "express-validator";
import errorValidator, { parseSkipLimit } from "./validator.js";

/**
 * Validates if a given field is a numeric integer.
 * @param {string} field - The field to validate.
 * @returns {object} - The validation object.
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
 * Validates if the cartItemId is not null and is a numeric integer.
 * @type {Array} - The validation array.
 */

export const cartItemIdValidator = [param("cartItemId").notEmpty().withMessage("cartItemId is required"), isNumericInt("cartItemId"), errorValidator];

/**
 * Validates if the cartItem is not null and is a numeric integer.
 * @type {Array} - The validation array.
 */

export const cartItemValidator = [  body("product_id").notEmpty().withMessage("product_id is required").isNumeric().withMessage("product_id must be a number"),
                                    body("quantity").notEmpty().withMessage("quantity is required").isNumeric().withMessage("quantity must be a number"),
                                    errorValidator];


/**
 * get all cartItem validator
 */

export const listCartItemValidator = [
    query("skip").optional().isNumeric().withMessage("skip needs to be a number"),
    query("limit").optional().isNumeric().withMessage("limit needs to be a number"),
    query("search_key").optional().isString().withMessage("search_key needs to be a string"),
    query("search_value").optional().isString().withMessage("search_value needs to be a string"),
    query("sort_key").optional().isString().withMessage("sort_key needs to be a string"),
    query("sort_order").optional().isString().withMessage("sort_order needs to be a string"),
    errorValidator
];