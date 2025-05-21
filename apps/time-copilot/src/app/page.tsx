import { Button } from '@/ui/button';
import { Heading } from '@/ui/heading';
import { Text } from '@/ui/text';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <Heading className="mb-6 text-center">HRIS Time Chatbot</Heading>
      <Text className="mb-8 text-center max-w-md">
        A chatbot interface for accessing HRIS Time repository data and actions.
      </Text>
      <div className="w-full max-w-md p-6 border rounded-lg shadow-sm">
        <div className="h-64 mb-4 overflow-y-auto border rounded p-4 bg-gray-50">
          {/* Chat messages will go here */}
          <Text className="text-center text-gray-500 italic">
            Welcome to the HRIS Time Chatbot. How can I help you today?
          </Text>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            placeholder="Type your message..."
          />
          <Button>Send</Button>
        </div>
      </div>
    </main>
  );
}
