import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'Project Management App',
  description: 'A simple project management app built with Next.js and Laravel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}