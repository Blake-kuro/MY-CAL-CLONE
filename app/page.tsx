import { db } from "./lib/db";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { UserPlus, Users, ArrowRight } from "lucide-react";

export default async function HomePage() {
	const users = await db.user.findMany({
		orderBy: { id: "desc" },
	});

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
			revalidatePath("/");
		} catch (error) {
			console.error("创建用户失败:", error);
		}
	}

	return (
		<div className="min-h-screen bg-[#F3F4F6] py-16 px-4">
			<div className="max-w-2xl mx-auto">
				{/* Header */}
				<header className="text-center mb-12">
					<div className="inline-block bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
						Beta v1.0
					</div>
					<h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">
						MY-CAL <span className="text-gray-400">CLONE</span>
					</h1>
					<p className="text-lg text-gray-600 font-medium">
						开源预约系统的极简复刻版
					</p>
				</header>

				{/* 1. 创建用户卡片 - 增强了对比度 */}
				<section className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-10">
					<div className="flex items-center gap-2 mb-8">
						<div className="bg-gray-100 p-2 rounded-lg text-gray-900">
							<UserPlus size={20} />
						</div>
						<h2 className="text-xl font-bold text-gray-900">初始化测试账号</h2>
					</div>

					<form action={createUser} className="space-y-5">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<div className="space-y-2">
								<label
									htmlFor="display-name"
									className="text-xs font-bold text-gray-500 ml-1 uppercase cursor-pointer"
								>
									显示名称
								</label>
								<input
									id="display-name" // <--- 加上这个 id
									name="name"
									type="text"
									placeholder="例如: Black"
									className="w-full bg-white text-gray-900 border border-gray-200 p-4 rounded-2xl focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-gray-400"
									required
								/>
							</div>
							<div className="space-y-2">
								<label
									htmlFor="user-id"
									className="text-xs font-bold text-gray-500 ml-1 uppercase cursor-pointer"
								>
									唯一标识 (URL)
								</label>
								<input
									id="user-id" // <--- 加上这个 id
									name="username"
									type="text"
									placeholder="例如: black"
									className="w-full bg-white text-gray-900 border border-gray-200 p-4 rounded-2xl focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-gray-400"
									required
								/>
							</div>
						</div>
						<div className="space-y-2">
							<label
								htmlFor="user-email"
								className="text-xs font-bold text-gray-500 ml-1 uppercase cursor-pointer"
							>
								电子邮箱
							</label>
							<input
								id="user-email" // <--- 加上这个 id
								name="email"
								type="email"
								placeholder="hello@example.com"
								className="w-full bg-white text-gray-900 border border-gray-200 p-4 rounded-2xl focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-gray-400"
								required
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-black active:scale-[0.98] transition-all shadow-lg shadow-gray-200"
						>
							立即生成预约主页
						</button>
					</form>
				</section>

				{/* 2. 用户列表 - 优化了卡片感 */}
				<section>
					<div className="flex items-center justify-between mb-6 px-2">
						<div className="flex items-center gap-2 text-gray-500">
							<Users size={16} />
							<span className="text-sm font-bold uppercase tracking-widest">
								活跃用户
							</span>
						</div>
						<span className="bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-full border border-gray-200 shadow-sm">
							{users.length}
						</span>
					</div>

					<div className="grid gap-4">
						{users.length === 0 ? (
							<div className="text-center py-16 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-medium">
								暂无用户数据，请先创建。
							</div>
						) : (
							users.map((user) => (
								<Link
									key={user.id}
									href={`/${user.username}`}
									className="group flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl hover:border-black hover:shadow-xl hover:-translate-y-1 transition-all"
								>
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-lg">
											{user.name?.[0].toUpperCase()}
										</div>
										<div>
											<p className="font-bold text-gray-900 text-lg leading-tight">
												{user.name}
											</p>
											<p className="text-sm text-gray-400 font-medium italic">
												localhost:3000/{user.username}
											</p>
										</div>
									</div>
									<div className="bg-gray-50 p-2 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
										<ArrowRight size={20} />
									</div>
								</Link>
							))
						)}
					</div>
				</section>
			</div>
		</div>
	);
}
