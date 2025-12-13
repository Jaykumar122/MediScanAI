import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      router.push('/login');
      return;
    }

    // Optional: Verify token with backend
    fetch('/api/auth/login', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (res.ok) {
        setIsAuthorized(true);
      } else {
        localStorage.removeItem('adminToken');
        router.push('/login');
      }
    })
    .catch(() => {
      localStorage.removeItem('adminToken');
      router.push('/login');
    });
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}