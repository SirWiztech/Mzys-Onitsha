import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import FloatingSocial from '@/components/floating-social';
import CookieConsent from '@/components/cookie-consent';
import { getSession } from '@/lib/auth';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  try {
    user = await getSession();
  } catch (err) {
    // DB connection may fail in production — don't crash the page
    console.error('[public-layout] getSession() failed:', err instanceof Error ? err.message : String(err));
    if (err instanceof Error && err.stack) console.error('[public-layout] Stack:', err.stack);
  }

  return (
    <>
      <Navbar user={user ? { role: user.role } : null} />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingSocial />
      <CookieConsent />
    </>
  );
}
