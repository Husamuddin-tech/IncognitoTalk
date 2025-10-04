'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
  Not signed in <br />
  <button
    className="bg-amber-500 text-white font-medium px-5 py-2 rounded-full shadow-md hover:bg-amber-600 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400"
    onClick={() => signIn()}
  >
    Sign in
  </button>
</>

  );
}
