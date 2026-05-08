'use client'
import { useEffect } from 'react'
import { api } from '@/services/api'
import { useAuthStore } from '@/store/authStore'

export function useUserSync(){
  const user = useAuthStore((s:any)=>s.user)
  const setUser = useAuthStore((s:any)=>s.setUser)

  useEffect(()=>{
    if(user?.id){
      api.get(`/auth/profile/${user.id}`).then(res=>setUser(res.data))
    }
  },[user?.id])
}
