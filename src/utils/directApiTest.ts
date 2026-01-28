import type { Message } from '../types/chat';

/**
 * API Configuration
 */
interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * API Request payload
 */
interface ApiRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

/**
 * API Response
 */
interface ApiResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Stream chunk response
 */
interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: 'assistant';
      content?: string;
    };
    finish_reason: string | null;
  }>;
}

/**
 * Default configuration
 */
const defaultConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.openai.com/v1',
  model: import.meta.env.VITE_API_MODEL || 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 2000,
};

/**
 * Convert internal messages to API format
 */
function convertMessagesToApiFormat(messages: Message[]): ApiRequest['messages'] {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
}

/**
 * Direct API call without streaming
 */
export async function sendDirectApiRequest(
  messages: Message[],
  config: Partial<ApiConfig> = {}
): Promise<ApiResponse> {
  const finalConfig = { ...defaultConfig, ...config };

  const payload: ApiRequest = {
    messages: convertMessagesToApiFormat(messages),
    model: finalConfig.model,
    temperature: finalConfig.temperature,
    max_tokens: finalConfig.maxTokens,
    stream: false,
  };

  const response = await fetch(`${finalConfig.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(finalConfig.apiKey && { Authorization: `Bearer ${finalConfig.apiKey}` }),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`API request failed: ${response.status} - ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Streaming API call with callback for each chunk
 */
export async function sendStreamingApiRequest(
  messages: Message[],
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
  config: Partial<ApiConfig> = {}
): Promise<void> {
  const finalConfig = { ...defaultConfig, ...config };

  const payload: ApiRequest = {
    messages: convertMessagesToApiFormat(messages),
    model: finalConfig.model,
    temperature: finalConfig.temperature,
    max_tokens: finalConfig.maxTokens,
    stream: true,
  };

  try {
    const response = await fetch(`${finalConfig.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(finalConfig.apiKey && { Authorization: `Bearer ${finalConfig.apiKey}` }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`API request failed: ${response.status} - ${JSON.stringify(error)}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onComplete();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;

        if (trimmedLine.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmedLine.slice(6)) as StreamChunk;
            const content = data.choices[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            console.error('Failed to parse SSE data:', e);
          }
        }
      }
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Unknown error'));
  }
}

/**
 * Test API connection
 */
export async function testApiConnection(config: Partial<ApiConfig> = {}): Promise<boolean> {
  try {
    const testMessages: Message[] = [
      {
        id: 'test-1',
        role: 'user',
        content: 'Hello, this is a connection test.',
        timestamp: Date.now(),
      },
    ];

    await sendDirectApiRequest(testMessages, config);
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
}

/**
 * Get API configuration from environment
 */
export function getApiConfig(): ApiConfig {
  return {
    baseUrl: import.meta.env.VITE_API_BASE_URL || defaultConfig.baseUrl,
    apiKey: import.meta.env.VITE_API_KEY,
    model: import.meta.env.VITE_API_MODEL || defaultConfig.model,
    temperature: defaultConfig.temperature,
    maxTokens: defaultConfig.maxTokens,
  };
}

/**
 * Validate API key format
 */
export function isValidApiKey(apiKey: string): boolean {
  // Basic validation - OpenAI keys start with 'sk-'
  return apiKey.startsWith('sk-') && apiKey.length > 20;
}

/**
 * Mock API response for testing without a real API
 */
export function createMockApiResponse(userMessage: string): ApiResponse {
  return {
    id: `mock-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: 'gpt-3.5-turbo',
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: `Mock response to: "${userMessage}"\n\nThis is a simulated API response for testing purposes.`,
        },
        finish_reason: 'stop',
      },
    ],
    usage: {
      prompt_tokens: 10,
      completion_tokens: 20,
      total_tokens: 30,
    },
  };
}
