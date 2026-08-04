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
  const user = await getSession();

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
