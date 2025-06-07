import React from 'react'
import CarsList from './components/cars-list'
import { Metadata } from 'next'

export const metadata:Metadata = {
    title:"Cars | Carsense Admin",
    description:"Carsense Admin Panel - Cars",
}

const CarsPage = () => {
  return (
    <div className='p-6'>
        <h1 className='text-2xl font-bold mb-6'> Cars Management</h1>
        <CarsList />
    </div>
  )
}

export default CarsPage