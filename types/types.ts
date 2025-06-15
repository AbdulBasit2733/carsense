// enums (as per Prisma schema)
export type BookingStatusProps = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type DayOfWeekProps = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
export type CarStatusProps = 'AVAILABLE' | 'SOLD' | 'PENDING' | 'UNAVAILABLE';


export interface WorkingHourProps {
  id: string;
  dealershipId: string;
  dayOfWeek: DayOfWeekProps;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface DealerShipInfoProps {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: WorkingHourProps[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface UserTestDriveProps {
  id: string;
  status: BookingStatusProps;
  bookingDate: string; // ISO string
}

export interface CarProps {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  seats: number;
  description: string;
  status: CarStatusProps;
  featured: boolean;
  images: string[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CarDetailsProps extends CarProps {
  featured: boolean; // from serializedCarData
}

export interface TestDriveInfoProps {
  existingBookings: UserTestDriveProps[] | [];
  dealership: DealerShipInfoProps | null;
}

export interface GetCarByIdResponse {
  success: boolean;
  data: CarDetailsProps & {
    testDriveInfo: TestDriveInfoProps;
  };
  error?: string;
}
