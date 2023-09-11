import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../store';
import { Roboto } from 'next/font/google';
import 'tw-elements/dist/css/tw-elements.min.css';
import { SessionProvider } from 'next-auth/react';
const roboto = Roboto({ weight: '400', subsets: ['latin'] });
export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	return (
		<>
			<style
				jsx
				global
			>{`
				html {
					font-family: ${roboto.style.fontFamily};
				}
			`}</style>
			<Provider store={store}>
				<SessionProvider session={session}>
					<Component {...pageProps} />
				</SessionProvider>
			</Provider>
		</>
	);
}
