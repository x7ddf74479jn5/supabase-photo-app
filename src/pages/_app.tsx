import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import { Auth } from '@supabase/ui';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import { supabase } from '@/lib/supabaseClient';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <ToastContainer position='bottom-right' autoClose={3000} />
      <Component {...pageProps} />
    </Auth.UserContextProvider>
  );
}

export default MyApp;
