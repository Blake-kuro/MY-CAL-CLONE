// commitlint.config.js
module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		// 比如：强制要求 type 必须是以下几种
		"type-enum": [
			2,
			"always",
			[
				"feat", // 新功能
				"fix", // 修 Bug
				"docs", // 文档
				"style", // 格式
				"refactor", // 重构
				"chore", // 杂事
				"research", // <--- 你自己加的：比如记录 BCI 信号解析的实验代码
				"infra", // <--- 你自己加的：比如修改 Docker 配置
			],
		],
		// 你还可以限制标题长度
		"header-max-length": [2, "always", 72],
	},
};
