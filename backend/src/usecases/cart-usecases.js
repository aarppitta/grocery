import { REDIS_DEFAULT_EXPIRY } from "../resources/constants.js";
import { mySQL } from "../services/mysql-service.js";
import redisHelper  from "../helpers/redis-helper.js";
import base64Helper from "../helpers/base64-helper.js";
import { sql } from "kysely";
/**
 * Function which is used to list cart based on different filter conditions
 * @param {string} userId
 * @param {{searchKey: string}} filters
 * @param {string[]} select
 * @param {number} skip
 * @param {number} limit
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */


export const listCarts = async (userId, productId,{ searchKey }, select, skip = 0, limit = 10, { mysqlService, redisService }) => {
    const redisKey = `cart.${searchKey}.list.` + base64Helper.jsonToBase64({ searchKey, skip, limit, select });
    const redisData = await redisService.get(redisKey);
    if (redisData) return JSON.parse(redisData);
    
    let query = mysqlService
        .selectFrom('cart')
        .select(select || ["cart_id", "product_id", "quantity", "created_at", "updated_at"])
        .where((st) => st.and([ st("is_deleted", "=", false) , st("user_id", "=", userId), st("product_id", "=", productId)]))
        .orderBy('cart_id')
        .limit(limit)
        .offset(skip);

    // search key
    if (searchKey) {
        query = query
        .where(sql`CONCAT(quantity, created_at, updated_at) LIKE ${`%${searchKey}%`}`); 
    }

    const response = await query.execute();
    await redisService.set(redisKey, JSON.stringify(response), REDIS_DEFAULT_EXPIRY);
    return response;
};

/**
 * Function which is used to get cart by id
 * @param {string} userId
 * @param {number} productId
 * @param {number} cartId
 * @param {string[]} select
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const getCartById = async (userId, productId, cartId, select, { mysqlService, redisService }) => {
    const redisKey = `cart.${userId}.${cartId}.${productId}` + base64Helper.jsonToBase64({ cartId });
    const redisData = await redisService.get(redisKey);
    if (redisData) return JSON.parse(redisData);
    
    const response = await mysqlService
        .selectFrom("cart")
        .select(select || ["cart_id", "product_id","category_id", "quantity", "created_at", "updated_at"])
        .where((st) => st.and([ st("cart_id", "=", cartId), st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
        .execute();
    
    const data = response?.[0] || null;
    if (data) await redisService.set(redisKey, JSON.stringify(data), REDIS_DEFAULT_EXPIRY);
    return data;
}

/**
 * Function which is used to create cart
 * @param {string} userId
 * @param {number} productId
 * @param {number} quantity
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

 
export const createCart = async (userId, productId, quantity,select, { mysqlService, redisService }) => {
    const response = await mysqlService
        .insertInto("cart")
        .values({ 
            user_id: userId, 
            quantity: quantity,
            product_id: productId,
            created_at: new Date(),
        }).execute();

        const result = await mysqlService.selectFrom("cart")
        .select(select || ["cart_id", "product_id", "quantity", "created_at", "updated_at"])
        .where((st) => st.and([ st("cart_id", "=", response[0].insertId)]))
        .execute();

        await redisHelper.delRegex(`cart.*`, { redisService });
        const data = result?.[0] || null;
        return data;
}

/**
 * Function which is used to update cart
 * @param {string} userId
 * @param {number} productId
 * @param {number} cartId
 * @param {number} quantity
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const updateCart = async (userId, productId, cartId, quantity, { mysqlService, redisService }) => {
    
    const updateObject = { updated_at: new Date() };
    if (quantity) updateObject.quantity = quantity;

    const response = await mysqlService.selectFrom("cart")
    .updateTable("cart")
    .where((st) => st.and([ st("cart_id", "=", cartId), st("is_deleted", "=", false), st("user_id", "=", userId), st("product_id", "=", productId)]))
    .set(updateObject)
    .execute();

    await redisHelper.delRegex(`cart.*`, { redisService });
    const data = result?.[0] || null;
    return data;

};

/**
 * Function which is used to delete cart
 * @param {string} userId
 * @param {number} productId
 * @param {number} cartId
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const deleteCart = async (userId, productId, cartId, { mysqlService, redisService }) => {
    const response = await mysqlService
    .updateTable("cart")
    .where((st) => st.and([ st("cart_id", "=", cartId), st("is_deleted", "=", false), st("user_id", "=", userId), st("product_id", "=", productId)]))
    .set({ is_deleted: true })
    .execute();
    
await redisHelper.delRegex(`cart.*`, { redisService });
return response != null ? {'cart_id':cartId} : null;
};