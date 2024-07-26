import stringHelper from "../helpers/string-helper.js";

/**
 * Function which is used to get user by id
 * @param { string } userId
 * @param { Object } select
 * @param { { mysqlService } } dependencies
 * @returns
 */
export const getUserById = async (userId, select, { mysqlService }) => {
  const response = await mysqlService
    .selectFrom("user")
    .select(select || ["user_id", "name", "password", "email"])
    .where("user_id", "=", userId)
    .limit(1)
    .execute();
  return response?.[0] || null;
};

/**
 * Function which is used to get user by email
 * @param { string } email
 * @param { Object } select
 * @param { { mysqlService } } dependencies
 * @returns
 */
export const getUserByEmail = async (email, select, { mysqlService }) => {
  const response = await mysqlService
    .selectFrom("user")
    .where("email", "=", email)
    .select(select || ["user_id", "name", "password", "email"])
    .limit(1)
    .execute();
  return response?.[0] || null;
};

/**
 * Function which is used to create a new user account
 * @param { string } name
 * @param { string } email
 * @param { string } password
 * @param { { mysqlService, bcryptService } } dependencies
 */
export const createUser = async (name, email, password, { mysqlService, bcryptService }) => {
  const hashedPassword = await bcryptService.hash(password);
  const displayName = name.toLowerCase();
  const normalizedName = stringHelper.camelize(name);
  let user = {
    name: normalizedName,
    email: email.toLowerCase(),
    password: hashedPassword,
    display_name: displayName,
    updated_at: new Date(),
  };
  
  const [savedUserId] = await mysqlService.insertInto("user").values(user).execute();
  if (!savedUserId.insertId) return null;
  const savedUser = await mysqlService.selectFrom('user').select(["user_id","name","password","email"]).where('user_id',"=",savedUserId.insertId.toString()).limit(1).execute();
  return savedUser?.[0] || null;
};

/**
 * Function which is used to update the user password
 * @param { number } userId
 * @param { string } password
 * @param { { mysqlService, bcryptService } } dependencies
 */
export const updateUserPassword = async (userId, password, { mysqlService, bcryptService }) => {
  const hashedPassword = await bcryptService.hash(password);
  return mysqlService
    .updateTable("user")
    .set({
      password: hashedPassword,
      updated_at: new Date(),
    })
    .where("user_id", "=", userId)
    .executeTakeFirst();
};
