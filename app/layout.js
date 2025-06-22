import './globals.css'
import Footer from '@/components/Footer'
import SessionWrapper from '@/components/SessionWrapper'

export const metadata = {
  title: 'DisasterRelief - Crowdfunding Platform',
  description: 'Help communities rebuild after natural disasters',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body> 
        <SessionWrapper>
         
          {children}
          <Footer/>
        </SessionWrapper>
      </body>
    </html>
  )
}