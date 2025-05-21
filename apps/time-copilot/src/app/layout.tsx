import './globals.css';

export const metadata = {
  title: 'Time Management Assistant',
  description: 'AI assistant for managing your time and leave',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F9F9FB] antialiased">{children}</body>
    </html>
  );
}
