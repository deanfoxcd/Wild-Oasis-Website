// export function middleware(request) {
//   console.log(request);
// }

import { auth } from './app/_lib/auth';

export const middleware = auth;

export const config = {
  matcher: ['/account'],
};
