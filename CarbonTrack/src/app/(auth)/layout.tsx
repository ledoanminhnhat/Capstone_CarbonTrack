import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden relative md:block md:w-[35%] overflow-hidden">
        <Image
          src="/assets/background.png"
          alt="Forest background"
          fill
          priority
          sizes="35vw"
          unoptimized={true}
          className="object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#e3f2e6]">
        <div className="bg-white px-8 py-12 rounded-lg w-full max-w-[450px] flex flex-col items-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/assets/logo.png"
              alt="CarbonTrack Logo"
              width={64}
              height={64}
              className="mb-1"
            />
            <h1 className="text-3xl font-semibold text-[#333] m-0">CarbonTrack</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
