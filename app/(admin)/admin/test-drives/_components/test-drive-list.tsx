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
import useFetch from "@/hooks/use-fetch";
import { CalendarRange, Loader2, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const TestDriveList = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const {
    loading: fetchingTestDrives,
    fn: fetchTestDrives,
    data: testDrivesData,
    error: testDrivesError,
  } = useFetch(getAdminTestDrives);
  const {
    loading: updatingStatus,
    fn: updateStatusFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateTestDriveStatus);
  const {
    loading: cancelling,
    fn: cancelTestDriveFn,
    data: cancelResult,
    error: cancelError,
  } = useFetch(cancelTestDrive);
  //@ts-ignore

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    fetchTestDrives({ search, status: statusFilter });
  };
  //@ts-ignore

  const handleUpdateStatus = async (bookingId, newStatus) => {
    if (newStatus) {
      await updateStatusFn(bookingId, newStatus);
    }
  };

  useEffect(() => {
    //@ts-ignore

    if (updateResult?.success) {
      toast.success("Test drive status updated successfully");
      fetchTestDrives({ search, status: statusFilter });
    }
    //@ts-ignore

    if (cancelResult?.success) {
      toast.success("Test drive cancelled successfully");
      fetchTestDrives({ search, status: statusFilter });
    }

    if (cancelError) {
      toast.error("Failed to cancel test drive");
    }
  }, [updateResult, cancelResult]);

  useEffect(() => {
    fetchTestDrives({ search, status: statusFilter });
  }, [search, statusFilter]);
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
                //@ts-ignore

                testDrivesData?.data?.map((booking) => (
                  <div key={booking.id} className="relative">
                    <TestDriveCard
                      booking={booking}
                      onCancel={cancelTestDriveFn}
                      showActions={["PENDING", "CONFIRMED"].includes(
                        booking.status
                      )}
                      isAdmin={true}
                      isCancelling={cancelling}
                      //@ts-ignore

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
