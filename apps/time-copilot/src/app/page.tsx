import Image from 'next/image';
import Link from 'next/link';
import { ActionsGrid } from '../components/ActionsGrid';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center w-full h-full p-6 relative overflow-y-auto">
      <div className="w-full max-w-5xl relative z-10 min-h-min pb-20">
        <div className="bg-white/90 backdrop-blur-sm px-8 py-6 rounded-3xl shadow-lg ring-1 ring-blue-100 mb-5 relative overflow-hidden">
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center">
              <Image
                src="/mug.svg"
                alt="Coffee mug"
                width={70}
                height={70}
                className="mr-4"
              />
              <div className="text-left">
                <h1 className="text-2xl font-bold text-[#234991]">
                  Welcome, Nigel
                </h1>
                <p className="text-blue-600">
                  I&apos;m ready to help with your schedule today
                </p>
              </div>
            </div>
            <Image
              src="/sunshade.svg"
              alt="Sunshade"
              width={75}
              height={75}
              className="opacity-90"
            />
          </div>
        </div>

        <ActionsGrid />
      </div>

      {/* Fixed Assistant banner at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-4 pointer-events-none">
        <div className="max-w-5xl mx-auto pointer-events-auto">
          {/* 3D Glass Cosmic Copilot Link */}
          <Link href="/copilot" className="block">
            <div
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 via-indigo-500/25 to-purple-600/30 backdrop-blur-md border border-white/30 shadow-[0_10px_30px_rgba(59,130,246,0.2)] transition-all duration-500 group hover:shadow-[0_20px_40px_rgba(99,102,241,0.3)] hover:border-blue-300/50 hover:scale-[1.02] p-0.5"
              style={{
                transform: 'translateZ(0)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Glass inner border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-white/20 opacity-50"></div>

              {/* Inner content with glass effect */}
              <div className="relative rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/30 backdrop-blur-sm p-5 overflow-hidden">
                {/* Simplified background for the fixed banner */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-indigo-400/15 to-purple-500/20 opacity-70"></div>

                {/* Main content */}
                <div className="relative flex items-center space-x-4 py-2 z-10">
                  {/* 3D orbiting icon */}
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-600/20 group-hover:shadow-blue-500/40 group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-300 group-hover:scale-110">
                    <div className="animate-[spin_10s_linear_infinite] group-hover:animate-[spin_5s_linear_infinite] transition-all">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] tracking-wide group-hover:drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] transition-all duration-300">
                      Time Copilot Assistant
                    </h3>
                    <p className="text-white/90 text-sm mt-0.5 font-medium drop-shadow-sm group-hover:text-white transition-colors">
                      Start an AI conversation about your schedule
                    </p>
                  </div>

                  {/* Arrow indicator with animation */}
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300 group-hover:translate-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
