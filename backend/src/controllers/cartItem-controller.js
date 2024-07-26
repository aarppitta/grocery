//Library imports
import Express from "express";

// Service imports
import mysqlService from "../services/mysql-service.js";
import redisService from "../services/redis-service.js";

// use cases imports & constants
import { createCartItem, deleteCartItem, getCartItemById, listCartItems, updateCartItem } from "../usecases/cartItem-usecases.js";

// helper imports
import base64Helper from "../helpers/base64-helper.js";
import { metricsLogError, parseError } from "prom-nodejs-client";
/**
 * Controller function to get the list of cartItem
 * @param { Express.Request } req - The request object
 * @param { Express.Response } res - The response object
 */

const listCartItemsController = async (req, res) => {
    const userId = req.auth.user.user_id;
    const { skip, limit } = req.query;
    const searchKey = base64Helper.decode(req.query.search_key);
    try {
        const response = await listCartItems(userId, { searchKey }, null, skip, limit, { mysqlService, redisService });
        res.status(200).json({
        message: "cartItems retrieved",
        data: response,
        });
    } catch (ex) {
        metricsLogError("listCartItemsController: ", ex);
        console.log("listCartItemsController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    }

/**
 * Controller function to get the cartItem by id
 * @param { Express.Request } req - The request object
 * @param { Express.Response } res - The response object
 */

const getCartItemByIdController = async (req, res) => {
    const userId = req.auth.user.user_id;
    const cartItemId = parseInt(req.params.cartItemId);
    try {
        const response = await getCartItemById(userId, cartItemId, null, { mysqlService, redisService });

        if (response == null) {
        return res.status(404).json({
            message: "cartItem not found",
        });
        }
        res.status(200).json({
        message: "cartItem retrieved",
        data: response,
        });
    } catch (ex) {
        metricsLogError("getCartItemByIdController: ", ex);
        console.log("getCartItemByIdController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    }

/**
 * Controller function to create a cartItem item
 * @param { Express.Request } req - The request object
 * @param { Express.Response } res - The response object
 */

const createCartItemController = async (req, res) => {
    const userId = req.auth.user.user_id;
    const { quantity } = req.body;
    try {
        const response = await createCartItem(userId, { quantity }, null, { mysqlService, redisService });
        res.status(201).json({
        message: "cartItem created",
        data: response,
        });
    } catch (ex) {
        metricsLogError("createCartItemController: ", ex);
        console.log("createCartItemController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    }

/**
 * Controller function to update a cartItem item
 * @param { Express.Request } req - The request object
 * @param { Express.Response } res - The response object
 */

const updateCartItemController = async (req, res) => {
    const userId = req.auth.user.user_id;
    const cartItemId = parseInt(req.params.cartItemId);
    const { quantity } = req.body;
    try {

        const cartItem_exist = await getProductById(cartItemId, null, { mysqlService, redisService });
        if (cartItem_exist == null) {
        return res.status(404).json({
        message: "cartItem not found",
        data: null,
      });
    }
        const response = await updateCartItem(userId, cartItemId, { quantity }, null, { mysqlService, redisService });
        res.status(200).json({
        message: "cartItem updated",
        data: response,
        });
    } catch (ex) {
        metricsLogError("updateCartItemController: ", ex);
        console.log("updateCartItemController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    }

/**
 * Controller function to delete a cartItem item
 * @param { Express.Request } req - The request object
 * @param { Express.Response } res - The response object
 */

const deleteCartItemController = async (req, res) => {
    const userId = req.auth.user.user_id;
    const cartItemId = parseInt(req.params.cartItemId);
    try {

        const cartItem_exist = await getProductById(userId, cartItemId, null, { mysqlService, redisService });
        if (cartItem_exist == null) {
        return res.status(404).json({
            message: "cartItem not found",
            data: null,
            });
        }

        const response = await deleteCartItem(userId, cartItemId, null, { mysqlService, redisService });
        res.status(200).json({
        message: "cartItem deleted",
        data: response,
        });
    } catch (ex) {
        metricsLogError("deleteCartItemController: ", ex);
        console.log("deleteCartItemController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    }

/**
 * export all controller
 */

const cartItemController = {
    listCartItemsController,
    getCartItemByIdController,
    createCartItemController,
    updateCartItemController,
    deleteCartItemController,
};

export default cartItemController;