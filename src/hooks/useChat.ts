import { useState, useRef, useCallback } from 'react';
import type { Message } from '../types/chat';

// Начальные сообщения для чата
const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m ChatGPT. How can I help you today?',
    timestamp: Date.now()
  }
];

// Текст для симулированного ответа
const mockResponses = [
  'That\'s an interesting question! Let me think about this...\n\nBased on my understanding, I can provide you with a comprehensive answer. There are several aspects to consider here:\n\n1. **First point**: This is an important consideration that affects the overall outcome.\n\n2. **Second point**: Another key factor to keep in mind is the context in which this applies.\n\n3. **Third point**: Finally, we should also consider the long-term implications.\n\nWould you like me to elaborate on any of these points?',
  'Great question! Here\'s what I can tell you:\n\nThe topic you\'re asking about is quite fascinating. Let me break it down for you:\n\n**Overview**\nThis concept has been around for quite some time and has evolved significantly over the years.\n\n**Key Points**\n- First, it\'s important to understand the fundamentals\n- Second, practical applications vary depending on the use case\n- Third, there are always trade-offs to consider\n\nIs there anything specific you\'d like me to clarify?',
  'I\'d be happy to help with that!\n\nHere\'s a detailed explanation:\n\nWhen we look at this topic, we need to consider multiple perspectives. The most common approach is to start with the basics and build up from there.\n\n**Step 1**: Understand the core concepts\n**Step 2**: Apply them to your specific situation\n**Step 3**: Iterate and refine based on feedback\n\nLet me know if you need more details on any of these steps!'
];

interface UseChatReturn {
  messages: Message[];
  isStreaming: boolean;
  sendMessage: (text: string) => void;
}

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const simulateStream = useCallback((responseText: string) => {
    setIsStreaming(true);

    // Создаем пустое сообщение assistant
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Печатаем текст символ за символом
    let currentChar = 0;
    const chars = responseText.split('');

    streamingIntervalRef.current = setInterval(() => {
      if (currentChar < chars.length) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: responseText.slice(0, currentChar + 1) }
              : msg
          )
        );
        currentChar++;
      } else {
        // Завершаем стриминг
        if (streamingIntervalRef.current) {
          clearInterval(streamingIntervalRef.current);
          streamingIntervalRef.current = null;
        }
        setIsStreaming(false);
      }
    }, 20); // Задержка 20мс между символами
  }, []);

  const sendMessage = useCallback((text: string) => {
    // Создаем сообщение пользователя
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMessage]);

    // Выбираем случайный ответ
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    // Запускаем симуляцию стриминга
    setTimeout(() => {
      simulateStream(randomResponse);
    }, 500);
  }, [simulateStream]);

  return {
    messages,
    isStreaming,
    sendMessage
  };
};
