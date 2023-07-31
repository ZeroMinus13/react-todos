import Providers from './components/Providers';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Todo',
  description: 'Create a todoList',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <link rel='icon' href='/icon?<generated>' type='image/<generated>' sizes='<generated>' />
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
