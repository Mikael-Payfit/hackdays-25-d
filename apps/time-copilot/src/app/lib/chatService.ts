import { mastraClient } from './mastra';

// Types
export type MessageRole = 'user' | 'bot';

export interface Message {
  id: string;
  text: string;
  sender: MessageRole;
  timestamp: string;
  isLoading?: boolean;
}

export class ChatService {
  private agent;

  constructor() {
    this.agent = mastraClient.getAgent('hris-time-assistant');
  }

  async sendMessage(message: string): Promise<Response> {
    try {
      // Send message to agent and get streaming response
      const response = await this.agent.stream({
        messages: [{ role: 'user', content: message }],
      });

      return response;
    } catch (error) {
      console.error('Error sending message to agent:', error);
      throw error;
    }
  }

  // Helper method to process the stream
  processStream(
    response: Response,
    onChunk: (text: string) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const processChunks = async () => {
        try {
          const reader = response.body?.getReader();
          if (!reader) {
            reject(new Error('Response body is not readable'));
            return;
          }

          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              resolve();
              break;
            }

            const chunk = decoder.decode(value);
            onChunk(chunk);
          }
        } catch (error) {
          reject(error);
        }
      };

      processChunks();
    });
  }
}

// Create a singleton instance
export const chatService = new ChatService();
