import type { Metadata } from 'next'
import AdminDashboard from '@/components/admin/AdminDashboard'

export const metadata: Metadata = {
  title: 'Admin Update',
  description: 'Dashboard sederhana untuk menerbitkan kabar dan dokumentasi Setitik.',
}

export default function AdminPage() {
  return <AdminDashboard />
}
