import { db } from "./lib/db";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function HomePage() {
  // 1. 从数据库获取所有用户
  const users = await db.user.findMany({
    orderBy: { id: "desc" },
  });

  // 2. 定义一个简单的 Server Action 来处理表单提交
  async function createUser(formData: FormData) {
    "use server";
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;

    if (!name || !email || !username) return;

    try {
      await db.user.create({
        data: { name, email, username: username.toLowerCase() },
      });
      // 提交后刷新页面，让新用户出现在列表里
      revalidatePath("/");
    } catch (error) {
      console.error("创建用户失败:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            🗓️ MY-CAL CLONE
          </h1>
          <p className="text-gray-500">快速创建并查看你的预约主页</p>
        </header>

        {/* 第一部分：创建用户表单 */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-10">
          <h2 className="text-lg font-bold mb-6">新增测试用户</h2>
          <form action={createUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                type="text"
                placeholder="显示名称 (e.g. Black)"
                className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                required
              />
              <input
                name="username"
                type="text"
                placeholder="唯一标识 (e.g. black)"
                className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                required
              />
            </div>
            <input
              name="email"
              type="email"
              placeholder="电子邮箱"
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors"
            >
              创建并生成预约页
            </button>
          </form>
        </section>

        {/* 第二部分：用户列表 */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 px-2">
            已有用户列表 ({users.length})
          </h2>
          <div className="grid gap-3">
            {users.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                数据库空空如也，先在上方创建一个吧
              </div>
            ) : (
              users.map((user) => (
                <Link
                  key={user.id}
                  href={`/${user.username}`}
                  className="group flex items-center justify-between p-5 bg-white border border-gray-200 rounded-2xl hover:border-black hover:shadow-md transition-all"
                >
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-black">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500">/{user.username}</p>
                  </div>
                  <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
                    查看预约页 →
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}