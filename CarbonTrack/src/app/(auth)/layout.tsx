import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full">
      {/* FORM — bên trái */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-10 bg-white">
        <div className="w-full max-w-[400px]">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <Image src="/assets/logo.png" alt="CarbonTrack" width={36} height={36} />
            <span className="text-xl font-extrabold text-gradient-brand">CarbonTrack</span>
          </div>
          {children}
        </div>
      </div>

      {/* VISUAL — bên phải (ẩn trên mobile) */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-brand">
        {/* Ảnh nền mờ */}
        <Image
          src="/assets/background.png"
          alt=""
          fill
          priority
          unoptimized
          sizes="45vw"
          className="object-cover opacity-20 mix-blend-overlay"
        />
        {/* Vòng tròn trang trí */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-10 -left-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />

        {/* Nội dung */}
        <div className="relative z-10 flex flex-col justify-center px-14 text-white">
          <h2 className="text-5xl font-extrabold leading-tight mb-5">
            Track.<br />Reduce.<br />Grow.
          </h2>
          <p className="text-white/85 text-lg max-w-sm">
            Measure your carbon footprint, build greener habits, and watch your
            impact shrink — one activity at a time.
          </p>

          <div className="flex gap-8 mt-12">
            <div>
              <div className="text-3xl font-extrabold">4</div>
              <div className="text-white/80 text-sm">categories</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold">🌍</div>
              <div className="text-white/80 text-sm">lower CO₂</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold">🏆</div>
              <div className="text-white/80 text-sm">challenges</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
