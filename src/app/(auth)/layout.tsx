export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="selection:bg-cyber-purple/30 relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#05050A] text-white">
      {/* Repeating Geometric Pattern Background */}
      <div className="bg-cyber-pattern absolute inset-0 z-0 opacity-40" />

      {/* Subtle radial glow to pull focus to the center */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05),transparent_70%)]" />

      <div className="relative z-10 flex w-full flex-col overflow-auto">
        <main className="animate-in fade-in zoom-in-95 w-full duration-1000">
          {children}
        </main>
      </div>
    </div>
  );
}
