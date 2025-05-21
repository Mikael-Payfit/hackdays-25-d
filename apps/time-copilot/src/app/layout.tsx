import './globals.css';

export const metadata = {
  title: 'HRIS Time Chatbot',
  description:
    'A chatbot interface for accessing HRIS Time repository data and actions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
