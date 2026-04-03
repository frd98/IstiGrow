import './globals.css';
import Script from 'next/script';
import ServiceWorkerRegistrar from './ServiceWorkerRegistrar';

export const metadata = {
  title: 'Istigrow – Islamic Habit Tracker',
  description: 'Build your daily Istiqomah (consistency) with mindful Islamic habits. Track Morning Dhikr, Quran reading, and more.',
  manifest: '/manifest.json',
  themeColor: '#0c1a14',
  appleWebAppCapable: 'yes',
  appleWebAppStatusBarStyle: 'black-translucent',
  appleWebAppTitle: 'Istigrow',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
  openGraph: {
    title: 'Istigrow – Islamic Habit Tracker',
    description: 'Build consistent Islamic habits, one day at a time.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0c1a14',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-ZMC65BJTQB"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZMC65BJTQB');
            `,
          }}
        />
      </head>
      <body>
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  );
}
