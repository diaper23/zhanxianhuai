// 将 dist 产物镜像到 cdn/zx（jsdelivr 对中文路径 404，故用 ASCII 镜像路径）
// 用法：pnpm build 后运行 `node scripts/deploy-cdn.mjs`，然后 git 提交推送
import { cpSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const MAP = [
  ['dist/斩仙槐/界面/状态栏', 'cdn/zx/ui/status'],
  ['dist/斩仙槐/界面/创建调查员', 'cdn/zx/ui/create'],
  ['dist/斩仙槐/脚本/骰子检定样式', 'cdn/zx/script/dice'],
  ['dist/斩仙槐/脚本/变量结构', 'cdn/zx/script/schema'],
];

for (const [from, to] of MAP) {
  if (!existsSync(from)) {
    console.error('缺少产物：' + from + '（先运行 pnpm build）');
    process.exitCode = 1;
    continue;
  }
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
  console.log('已更新 ' + to);
}
