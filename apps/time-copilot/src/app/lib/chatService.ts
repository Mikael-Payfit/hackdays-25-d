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
  private threadId: string;
  private resourceId = 'USER'; // Single user ID for this PoC

  constructor() {
    this.agent = mastraClient.getAgent('hrisTimeAssistant');
    this.threadId = this.generateUUID();
    console.log('Created new conversation thread:', this.threadId);
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  createNewThread(): void {
    this.threadId = this.generateUUID();
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const response = await this.agent.generate({
        messages: [{ role: 'user', content: message }],
        threadId: this.threadId,
        resourceId: this.resourceId,
        memoryOptions: {
          lastMessages: 20,
        },
      });

      return response.text || '';
    } catch (error) {
      console.error('Error sending message to agent:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const chatService = new ChatService();
