import type { ChatMessage } from '@/screens/messages/types/chat.types';

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function groupByDate(messages: ChatMessage[]): Array<ChatMessage | string> {
  const result: Array<ChatMessage | string> = [];
  let lastDate = '';
  messages.forEach((msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
    if (date !== lastDate) {
      result.push(date);
      lastDate = date;
    }
    result.push(msg);
  });
  return result;
}
