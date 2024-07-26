import { REDIS_DEFAULT_EXPIRY } from "../resources/constants.js";
import { mySQL } from "../services/mysql-service.js";
import redisHelper  from "../helpers/redis-helper.js";
import base64Helper from "../helpers/base64-helper.js";
import { sql } from "kysely";

/**
 * Function which is used to list cartItem based on different filter conditions
 * @param {string} userId
 * @param {{searchKey: string}} filters
 * @param {string[]} select
 * @param {number} skip
 * @param {number} limit
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const listCartItems = async (userId, { searchKey }, select, skip = 0, limit = 10, { mysqlService, redisService }) => {
  const redisKey = `cartItem.${searchKey}.list.` + base64Helper.jsonToBase64({ searchKey, skip, limit, select });
  const redisData = await redisService.get(redisKey);
  if (redisData) return JSON.parse(redisData);

  let query = mysqlService
    .selectFrom('cart')
    .select(select || ["cart_item_id", "product_id","quantity", "created_at", "updated_at"])
    .where((st) => st.and([ st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
    .orderBy('created_at')
    .limit(limit)
    .offset(skip);

  // search key
  if (searchKey) {
    query = query
    .where(sql`CONCAT(cart_item_id, quantity) LIKE ${`%${searchKey}%`}`) ;
  }
  const response = await query.execute();
  await redisService.set(redisKey, JSON.stringify(response), REDIS_DEFAULT_EXPIRY);
  return response;
}

/**
 * Function which is used to get cartItem by id
 * @param {string} userId
 * @param {string} cartItemId
 * @param {string[]} select
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const getCartItemById = async (userId, cartItemId, select, { mysqlService, redisService }) => {
  const redisKey = `cartItem.${userId}.${cartItemId}.` + base64Helper.jsonToBase64({ cartItemId });
  const redisData = await redisService.get(redisKey);
  if (redisData) return JSON.parse(redisData);

  const response = await mysqlService
    .selectFrom("cart")
    .select(select || ["cart_id", "product_id","quantity", "created_at", "updated_at"])
    .where((st) => st.and([ st("cart_item_id", "=", cartItemId), st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
    .execute();

  const data = response?.[0] || null;
  if (data) await redisService.set(redisKey, JSON.stringify(data), REDIS_DEFAULT_EXPIRY);
  return data;
}

/**
 * Function which is used to create a new cartItem item
 * @param {string} userId
 * @param {number} quantity
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const createCartItem = async (userId, quantity, { mysqlService, redisService }) => {
  const response = await mysqlService
    .insertInto("cart")
    .values({ 
        user_id: userId, 
        quantity: quantity,
        created_at: new Date()
    })
    .execute();

    const result = await mysqlService.selectFrom("cart")
    .select(["cart_id", "product_id","quantity", "created_at", "updated_at"])
    .where((st) => st.and([ st("cart_id", "=", response[0].insertId)]))
    .execute();

    await redisHelper.delRegex(`cart.*`, { redisService });
    const data = result?.[0] || null;
    return data;

}

/**
 * Function which is used to update cartItem item
 * @param {string} userId
 * @param {string} cart_Id
 * @param {{number}} quantity
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const updateCartItem = async (userId, cart_Id, quantity, { mysqlService, redisService }) => {
  
    const updateObject = { updated_at: new Date() };
    if (quantity) updateObject.quantity = quantity;

    const response = await mysqlService
    .updateTable("cart")
    .where((st) => st.and([ st("cart_id", "=", cart_Id), st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
    .set(updateObject)
    .execute();

    const result = await mysqlService.selectFrom("cart")
    .select(["cart_id", "product_id","quantity", "created_at", "updated_at"])
    .where((st) => st.and([ st("cart_id", "=", cart_Id)]))
    .execute();

    await redisHelper.delRegex(`cart.*`, { redisService });
    const data = result?.[0] || null;
    return data;

}

/**
 * Function which is used to delete a cartItem item
 * @param {string} userId
 * @param {string} cart_Id
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const deleteCartItem = async (userId, cart_Id, { mysqlService, redisService }) => {
  const response = await mysqlService
  .updateTable("cart_item")
  .where((st) => st.and([ st("cart_Id", "=", cart_Id), st("user_id", "=", userId)]))
  .set({ is_deleted: true })
  .execute();

    await redisHelper.delRegex(`cart.*`, { redisService });
    return response != null ? {'cart_id':cart_Id} : null;
}


