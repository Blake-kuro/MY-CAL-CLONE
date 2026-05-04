import { Calendar, ChevronRight, Clock, Globe } from "lucide-react";
import { notFound } from "next/navigation";
import { db } from "../lib/db"; // 注意这里的路径

export default async function PublicBookingPage({ 
  params 
}: { 
  params: Promise<{ username: string }> // 注意这里标记为 Promise
}) {
  // 必须 await 之后才能拿到真正的 username
  const { username } = await params; 

  const user = await db.user.findUnique({
    where: { username }, // 现在 username 是真正的字符串了（比如 "black"）
    include: { availabilities: true },
  });

	if (!user) notFound();

	const weekMap: Record<number, string> = {
		1: "周一",
		2: "周二",
		3: "周三",
		4: "周四",
		5: "周五",
		6: "周六",
		0: "周日",
	};

	return (
		<div className="min-h-screen bg-[#F9FAFB] text-[#374151]">
			<div className="h-1 bg-black w-full" />
			<main className="max-w-[850px] mx-auto pt-16 px-4">
				<div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col md:flex-row overflow-hidden">
					<div className="w-full md:w-2/5 p-8 border-r border-gray-100 bg-gray-50/50">
						<div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">
							{user.name?.[0].toUpperCase()}
						</div>
						<h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
						<p className="text-sm text-gray-500 mb-6">@{user.username}</p>

						<div className="mt-8">
							<h3 className="text-xs font-bold uppercase text-gray-400 mb-4">
								常规档期
							</h3>
							<div className="space-y-2">
								{user.availabilities.map((av: any) => (
									<div
										key={av.id}
										className="text-xs bg-white border p-2 rounded-lg flex justify-between"
									>
										<span className="font-semibold">
											{weekMap[av.dayOfWeek]}
										</span>
										<span className="text-gray-500">
											{av.startTime} - {av.endTime}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="w-full md:w-3/5 p-8">
						<h2 className="text-lg font-bold mb-6">选择预约类型</h2>
						<div className="grid gap-4">
							{[
								{
									title: "15分钟 快速沟通",
									duration: "15 min",
									color: "bg-blue-500",
								},
							].map((event) => (
								<button
									type="button" // <--- 修复了 Biome 的 type 报错
									key={event.title}
									className="group flex items-center justify-between p-4 border rounded-xl hover:border-black transition-all"
								>
									<div className="flex items-center gap-4">
										<div className={`w-2 h-10 ${event.color} rounded-full`} />
										<h4 className="font-bold text-gray-900">{event.title}</h4>
									</div>
									<ChevronRight className="text-gray-300" />
								</button>
							))}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
