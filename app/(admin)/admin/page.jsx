import { getDashboardData } from '@/actions/admin'
import React from 'react'
import Dashboard from './components/dashboard'

export const metadata = {
  title:"Dashboard | Carsense Admin",
  description:"Admin dashboard for carsense marketplace"
}

const AdminPage = async () => {
  const dashbaordData = await getDashboardData()
  console.log("dahsboard", dashbaordData);

  if (!dashbaordData || !dashbaordData.data) {
    // Handle error or fallback UI
    return (
      <div className='p-6'>
        <h1 className='text-2xl font-bold mb-6'>Dashboard</h1>
        <div className="text-red-500">Failed to load dashboard data.</div>
      </div>
    );
  }

  const initialData = dashbaordData;
  
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Dashboard</h1>
      <Dashboard initialData={initialData}/>
    </div>
  )
}

export default AdminPage