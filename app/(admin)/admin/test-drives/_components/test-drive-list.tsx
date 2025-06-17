"use client";
import { getAdminTestDrives, updateTestDriveStatus } from "@/actions/admin";
import { cancelTestDrive } from "@/actions/test-drive";
import TestDriveCard from "@/components/test-drive-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CarProps } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { CalendarRange, Loader2, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export interface TestDriveBooking {
  id: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  notes: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  createdAt: string;
  updatedAt: string;
  userId: string;
  carId: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    imageUrl: string;
  };
  car: CarProps;
}

export interface TestDriveResponse {
  success: boolean;
  message: string;
  data: TestDriveBooking[];
}

const TestDriveList = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const {
    mutate: fetchTestDrives,
    data: testDrivesData,
    isPending: fetchingTestDrives,
    error: testDrivesError,
  } = useMutation<TestDriveResponse, Error, { search: string; status: string }>(
    {
      mutationFn: async ({ search, status }) => {
        const result = await getAdminTestDrives({ search, status });
        if (!("data" in result) || !Array.isArray(result.data)) {
          return {
            success: result.success,
            message: result.message,
            data: [],
          };
        }
        return result as TestDriveResponse;
      },
    }
  );

  // console.log("Drive Data", testDrivesData);

  // 2. Update Status
  const {
    mutate: updateStatus,
    isPending: updatingStatus,
    data: updateResult,
    error: updateError,
  } = useMutation({
    mutationFn: (args: { id: string; status: string }) =>
      updateTestDriveStatus(args.id, args.status),
  });

  // 3. Cancel Booking
  const {
    mutate: cancelBookingFn,
    isPending: cancelling,
    data: cancelResult,
    error: cancelError,
  } = useMutation({
    mutationFn: (bookingId: string) => cancelTestDrive(bookingId),
  });

  // Trigger fetch on mount and whenever filters change
  useEffect(() => {
    fetchTestDrives({ search, status: statusFilter });
  }, [search, statusFilter]);

  // React to update/cancel results
  useEffect(() => {
    if (updateResult?.success) {
      toast.success("Test drive status updated successfully");
      fetchTestDrives({ search, status: statusFilter });
    }
    if (updateError) {
      toast.error("failed to update test drive");
    }
    if (cancelResult?.success) {
      toast.success("Test drive cancelled successfully");
      fetchTestDrives({ search, status: statusFilter });
    }
    if (cancelError) {
      toast.error("Failed to cancel test drive");
    }
    if(testDrivesError){
      toast.error("Failed to fetch test drives")
    }
  }, [updateResult, cancelResult, cancelError, testDrivesError, updateError]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTestDrives({ search, status: statusFilter });
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    if (newStatus) updateStatus({ id, status: newStatus });
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 w-full items-start sm:items-center justify-between">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"All Statuses"}>All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELED">Cancelled</SelectItem>
            <SelectItem value="NO_SHOW">NO Show</SelectItem>
          </SelectContent>
        </Select>
        <form className="flex w-full" onSubmit={handleSearchSubmit}>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search by car or customer"
              className="pl-9 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button type="submit" className="ml-2">
            Search
          </Button>
        </form>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarRange className="h-5 w-5" />
            Test Drive Bookings
          </CardTitle>
          <CardDescription>
            Manage All test drive reservations and update their status
          </CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
          {fetchingTestDrives && !testDrivesData ? (
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          ) : (
            <div className="space-y-4">
              {testDrivesData &&
                testDrivesData?.data?.map((booking) => (
                  <div key={booking.id} className="relative">
                    <TestDriveCard
                      booking={booking}
                      onCancel={async (bookingId: string) => {
                        await cancelBookingFn(bookingId);
                      }}
                      showActions={["PENDING", "CONFIRMED"].includes(
                        booking.status
                      )}
                      isAdmin={true}
                      isCancelling={cancelling}
                      renderStatusSelector={() => (
                        <Select
                          value={booking.status}
                          disabled={updatingStatus}
                          onValueChange={(value) =>
                            handleUpdateStatus(booking.id, value)
                          }
                        >
                          <SelectTrigger className="w-full h-8">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            <SelectItem value="NO_SHOW">No Show</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestDriveList;
