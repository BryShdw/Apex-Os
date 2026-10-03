import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/common/Navbar';
import { ToastContainer } from '@/components/common/Toast';

export const metadata: Metadata = {
  title: 'Apex Personal OS | Centro de Mando de Brayan',
  description: 'Sistema integral de desarrollo personal, calistenia, finanzas y descanso',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#15181e] text-[#e2e8f0]">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
          {children}
        </main>
        <ToastContainer />
      </body>
    </html>
  );
}
