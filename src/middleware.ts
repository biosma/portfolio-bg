import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // 1) Redirige la raíz a un locale válido (/ -> /en o /es)
    '/',

    // 2) Para rutas YA prefijadas, asegura setear la cookie de idioma
    '/(en|es)/:path*',

    // 3) Para rutas SIN prefijo, agrega el locale que falte
    //    (e.g. /about -> /en/about o /es/about)
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  ]
};
