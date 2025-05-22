import Image from 'next/image';
import Link from 'next/link';
import { ActionsGrid } from '../components/ActionsGrid';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center w-full h-full p-6 relative overflow-y-auto">
      {/* Background rocket illustration */}
      <div className="fixed bottom-20 right-0 pointer-events-none z-0 opacity-80">
        <Image
          src="/rocket.svg"
          alt="Rocket illustration"
          width={300}
          height={300}
          priority
          className="translate-x-8"
        />
      </div>

      <div className="w-full max-w-5xl relative z-10 min-h-min pb-10">
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

        {/* 3D Glass Cosmic Copilot Link */}
        <div className="mb-6 transform-gpu perspective-[1000px]">
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
                {/* 3D Parallax effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-indigo-400/15 to-purple-500/20 opacity-70"></div>

                {/* Animated constellation background pattern */}
                <div className="absolute inset-0">
                  <svg
                    className="w-full h-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                    viewBox="0 0 200 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10,30 Q50,10 90,30 T170,30"
                      fill="none"
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    <path
                      d="M10,50 Q50,30 90,50 T170,50"
                      fill="none"
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    <path
                      d="M10,70 Q50,50 90,70 T170,70"
                      fill="none"
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    <path
                      d="M30,10 Q30,50 30,90"
                      fill="none"
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    <path
                      d="M70,10 Q70,50 70,90"
                      fill="none"
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    <path
                      d="M110,10 Q110,50 110,90"
                      fill="none"
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    <path
                      d="M150,10 Q150,50 150,90"
                      fill="none"
                      stroke="white"
                      strokeWidth="0.5"
                    />
                  </svg>
                </div>

                {/* Animated stars - different sizes, positions and animations */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute h-1 w-1 rounded-full bg-white top-[10%] left-[20%] animate-pulse"></div>
                  <div
                    className="absolute h-2 w-2 rounded-full bg-blue-300 top-[40%] left-[80%] animate-pulse"
                    style={{ animationDelay: '0.5s' }}
                  ></div>
                  <div
                    className="absolute h-1.5 w-1.5 rounded-full bg-indigo-300 top-[70%] left-[10%] animate-pulse"
                    style={{ animationDelay: '1s' }}
                  ></div>
                  <div
                    className="absolute h-1 w-1 rounded-full bg-white top-[20%] left-[50%] animate-pulse"
                    style={{ animationDelay: '1.5s' }}
                  ></div>
                  <div
                    className="absolute h-0.5 w-0.5 rounded-full bg-blue-200 top-[30%] left-[30%] animate-pulse"
                    style={{ animationDelay: '0.7s' }}
                  ></div>
                  <div
                    className="absolute h-0.5 w-0.5 rounded-full bg-indigo-200 top-[80%] left-[40%] animate-pulse"
                    style={{ animationDelay: '1.2s' }}
                  ></div>
                  <div
                    className="absolute h-1 w-1 rounded-full bg-purple-300 top-[50%] left-[70%] animate-pulse"
                    style={{ animationDelay: '0.9s' }}
                  ></div>
                  <div
                    className="absolute h-0.5 w-0.5 rounded-full bg-blue-200 top-[60%] left-[90%] animate-pulse"
                    style={{ animationDelay: '1.7s' }}
                  ></div>

                  {/* Additional stars for more detail */}
                  <div
                    className="absolute h-1.5 w-1.5 rounded-full bg-blue-100 top-[15%] left-[65%] animate-ping"
                    style={{ animationDuration: '4s', animationDelay: '1s' }}
                  ></div>
                  <div
                    className="absolute h-1 w-1 rounded-full bg-purple-100 top-[85%] left-[25%] animate-ping"
                    style={{ animationDuration: '5s', animationDelay: '0.5s' }}
                  ></div>
                  <div
                    className="absolute h-2 w-2 rounded-full bg-indigo-100 top-[55%] left-[85%] animate-ping"
                    style={{ animationDuration: '6s', animationDelay: '1.5s' }}
                  ></div>

                  {/* Shimmering stars */}
                  <div className="absolute h-1.5 w-1.5 rounded-full bg-white top-[35%] left-[45%] animate-[shimmer_3s_ease-in-out_infinite]"></div>
                  <div
                    className="absolute h-2.5 w-2.5 rounded-full bg-blue-200 top-[65%] left-[75%] animate-[shimmer_4s_ease-in-out_infinite]"
                    style={{ animationDelay: '1.5s' }}
                  ></div>
                  <div
                    className="absolute h-2 w-2 rounded-full bg-indigo-200 top-[25%] left-[15%] animate-[shimmer_5s_ease-in-out_infinite]"
                    style={{ animationDelay: '0.7s' }}
                  ></div>

                  {/* Light streaks */}
                  <div className="absolute h-px w-16 bg-gradient-to-r from-transparent via-blue-400/70 to-transparent -rotate-45 top-[25%] left-[60%] animate-[pulse_4s_ease-in-out_infinite]"></div>
                  <div
                    className="absolute h-px w-24 bg-gradient-to-r from-transparent via-indigo-400/70 to-transparent rotate-45 top-[65%] left-[30%] animate-[pulse_6s_ease-in-out_infinite]"
                    style={{ animationDelay: '2s' }}
                  ></div>

                  {/* Additional light streaks */}
                  <div
                    className="absolute h-px w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent rotate-[60deg] top-[40%] left-[20%] animate-[pulse_5s_ease-in-out_infinite]"
                    style={{ animationDelay: '1s' }}
                  ></div>
                  <div
                    className="absolute h-px w-32 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent -rotate-[30deg] top-[75%] left-[50%] animate-[pulse_7s_ease-in-out_infinite]"
                    style={{ animationDelay: '0.7s' }}
                  ></div>

                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/10 group-hover:opacity-70 opacity-0 transition-opacity duration-700"></div>

                  {/* Animated moving glow */}
                  <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent group-hover:animate-[moveLeftToRight_8s_linear_infinite] opacity-0 group-hover:opacity-100"></div>

                  {/* Additional moving glow */}
                  <div
                    className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-indigo-300/15 to-transparent group-hover:animate-[moveLeftToRight_12s_linear_infinite] opacity-0 group-hover:opacity-100"
                    style={{ animationDelay: '4s' }}
                  ></div>
                </div>

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

        <ActionsGrid />
      </div>
    </div>
  );
}
