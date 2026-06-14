export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-pattern opacity-50 z-0" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-container opacity-5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 z-0" />

      <main className="relative z-10 flex items-center justify-center min-h-screen px-5 py-8">
        {children}
      </main>
    </div>
  );
}
