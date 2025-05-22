import { HomeIcon, SparklesIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '../ui/navbar';
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from '../ui/sidebar';
import { StackedLayout } from '../ui/stacked-layout';
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
      <body className="antialiased">
        <div className="flex h-screen">
          {/* Desktop sidebar - visible on large screens */}
          <div className="hidden lg:block lg:w-64 lg:flex-shrink-0 bg-white/80 backdrop-blur-sm border-r border-blue-100 z-10">
            <div className="h-full">
              <Sidebar>
                <SidebarHeader className="flex justify-center items-center py-6">
                  <div className="w-full flex justify-center items-center px-4">
                    <Image
                      src="/logo.png"
                      alt="Time Copilot Logo"
                      width={200}
                      height={70}
                      className="mx-auto"
                      priority
                    />
                  </div>
                </SidebarHeader>
                <SidebarBody>
                  <SidebarSection>
                    <SidebarItem href="/">
                      <HomeIcon className="w-5 h-5" />
                      <SidebarLabel>Home</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem href="/copilot">
                      <SparklesIcon className="w-5 h-5" />
                      <SidebarLabel>Copilot</SidebarLabel>
                    </SidebarItem>
                  </SidebarSection>
                </SidebarBody>
              </Sidebar>
            </div>
          </div>

          {/* Main content with mobile navigation */}
          <div className="flex-1 flex flex-col h-screen">
            <StackedLayout
              navbar={
                <Navbar className="bg-white/80 backdrop-blur-sm border-b border-blue-100 z-10">
                  <Link href="/" className="flex items-center justify-center">
                    <Image
                      src="/logo.png"
                      alt="Time Copilot Logo"
                      width={150}
                      height={50}
                      priority
                    />
                  </Link>
                </Navbar>
              }
              sidebar={
                <Sidebar>
                  <SidebarHeader className="flex justify-center items-center py-6">
                    <div className="w-full flex justify-center items-center px-4">
                      <Image
                        src="/logo.png"
                        alt="Time Copilot Logo"
                        width={180}
                        height={60}
                        className="mx-auto"
                        priority
                      />
                    </div>
                  </SidebarHeader>
                  <SidebarBody>
                    <SidebarSection>
                      <SidebarItem href="/">
                        <HomeIcon className="w-5 h-5" />
                        <SidebarLabel>Home</SidebarLabel>
                      </SidebarItem>
                      <SidebarItem href="/copilot">
                        <SparklesIcon className="w-5 h-5" />
                        <SidebarLabel>Copilot</SidebarLabel>
                      </SidebarItem>
                    </SidebarSection>
                  </SidebarBody>
                </Sidebar>
              }
            >
              <div className="h-full">{children}</div>
            </StackedLayout>
          </div>
        </div>
      </body>
    </html>
  );
}
