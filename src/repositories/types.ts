import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type user = {
    user_id: Generated<number>;
    email: string;
    name: string;
    display_name: string;
    password: string;
    is_active: Generated<boolean>;
    is_deleted: Generated<boolean>;
    created_at: Generated<Timestamp>;
    updated_at: Timestamp;
};
export type DB = {
    user: user;
};
