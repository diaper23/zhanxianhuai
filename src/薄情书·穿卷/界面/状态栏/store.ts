import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../schema';

export const useDataStore = defineMvuDataStore(Schema, { type: 'message', message_id: getCurrentMessageId() }, (data) => {
  const store = useDataStore();
  // 使用酒馆宏注入真实玩家名，并轮询保障及时同步（以防切换角色/聊天）
  store.$patch({ user: substitudeMacros('{{user}}') });
  useIntervalFn(() => store.$patch({ user: substitudeMacros('{{user}}') }), 3000);
});
