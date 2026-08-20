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
  } catch {
    // DB connection may fail in production — don't crash the page
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
