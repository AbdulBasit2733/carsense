import { getDashboardData } from '@/actions/admin'
import React from 'react'
import Dashboard from './components/dashboard'
import { Metadata } from 'next'

export const metadata:Metadata = {
  title:"Dashboard | Carsense Admin",
  description:"Admin dashboard for carsense marketplace"
}

const AdminPage = async () => {
  const dashbaordData = await getDashboardData()
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Dashboard</h1>
      <Dashboard initialData={dashbaordData}/>
    </div>
  )
}

export default AdminPage