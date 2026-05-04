// lib/db.ts
import { PrismaClient } from "../generated/prisma/client";

// 为了防止在开发环境下，每次保存代码都创建一个新的 PrismaClient 实例
const prismaClientSingleton = () => {
	return new PrismaClient();
};

declare global {
	var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// 如果全局变量里已经有了 prisma 实例，就直接用；没有就新建一个
const db = globalThis.prisma ?? prismaClientSingleton();

export { db };

// 在开发环境下，把实例存到全局变量里
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
