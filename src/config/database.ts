import { prisma } from "./prisma/prisma_config";

const database = {
    instance: prisma,
};

export type IDBClient = typeof database;

Object.freeze(database);

export default database;
