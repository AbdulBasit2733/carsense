import { getDashboardData } from '@/actions/admin'
import React from 'react'
import Dashboard from './components/dashboard'
import { Metadata } from 'next'

export const metadata:Metadata = {
  title:"Dashboard | Carsense Admin",
  description:"Admin dashboard for carsense marketplace"
}

export interface DashboardDataProps {
  success: boolean;
  data: {
    cars: {
      total: number;
      available: number;
      unavailable: number;
      sold: number;
      featured: number;
    };
    testDrives: {
      total: number;
      confirmed: number;
      completed: number;
      cancelled: number;
      pending: number;
      noShow: number;
      conversionRate: number;
    };
  };
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

  const initialData:DashboardDataProps = dashbaordData;
  
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Dashboard</h1>
      <Dashboard initialData={initialData}/>
    </div>
  )
}

export default AdminPage