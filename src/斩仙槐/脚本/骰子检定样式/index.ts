import './global.css';
import { teleportStyle } from '@util/script';

$(() => {
  // 骰子卡六档配色由本脚本注入酒馆主文档（全局一份），替代原先正则替换里每卡内嵌的 <style> 块
  teleportStyle();
});
