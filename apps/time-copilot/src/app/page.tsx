import Image from 'next/image';
import { ActionsGrid } from '../components/ActionsGrid';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 relative">
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

      <div className="w-full max-w-5xl relative z-10">
        <div className="bg-white/90 backdrop-blur-sm px-8 py-8 rounded-3xl shadow-lg ring-1 ring-blue-100 mb-8 relative overflow-hidden">
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
    </div>
  );
}
