/**
 * Admin Authentication Hook
 * 
 * 檢查管理者登入狀態並保護頁面
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';

export function useAdminAuth() {
  const router = useRouter();
  const { user } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 檢查是否已登入且為管理者
    const token = localStorage.getItem('admin_token');
    
    if (!user || user.role !== 'admin' || !token) {
      // 未登入或非管理者，導向登入頁
      router.push('/admin/login');
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }
    
    setIsChecking(false);
  }, [user, router]);

  return { isChecking, isAuthorized };
}
