export const metadata = {
  title: 'SSC',
  description: 'Shelter Severity Classification',
};

import 'antd/dist/reset.css';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#f7f7f9' }}>{children}</body>
    </html>
  );
}
