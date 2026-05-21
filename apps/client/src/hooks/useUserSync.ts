import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export function useUserSync() {
  const { isAuthenticated, updateUser } = useAuthStore();

  const { data } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/users/me').then(r => r.data),
    enabled: isAuthenticated(),
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (data) updateUser(data);
  }, [data, updateUser]);

  return data;
}
