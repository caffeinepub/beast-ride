import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import { Toaster } from '@/components/ui/sonner';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div style={{ backgroundColor: '#0B0B0B', minHeight: '100vh' }}>
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            border: '1px solid rgba(209,0,0,0.3)',
            color: '#C9C9C9',
          },
        }}
      />
    </div>
  );
}
