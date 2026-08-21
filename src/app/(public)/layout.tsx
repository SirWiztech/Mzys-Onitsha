import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import FloatingSocial from '@/components/floating-social';
import CookieConsent from '@/components/cookie-consent';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  try {
    const { getSession } = await import('@/lib/auth');
    user = await getSession();
  } catch (err) {
    console.error('[public-layout] getSession() failed:', err instanceof Error ? err.message : String(err));
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
