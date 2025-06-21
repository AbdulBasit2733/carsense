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
import { useMutation } from "@tanstack/react-query";
import { CalendarRange, Loader2, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const TestDriveList = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // 1. Fetch test drives
  const {
    mutate: fetchTestDrives,
    data: testDrivesData,
    isPending: fetchingTestDrives,
    error: testDrivesError,
  } = useMutation({
    mutationFn: async ({ search, status }) => {
      try {
        const result = await getAdminTestDrives({ search, status });
        if (!result?.success || !Array.isArray(result.data)) {
          throw new Error(result?.message || "Invalid response format");
        }
        return result;
      } catch (err) {
        console.error("Fetch error:", err);
        throw err;
      }
    },
  });

  // 2. Update Status
  const {
    mutate: updateStatus,
    isPending: updatingStatus,
    data: updateResult,
    error: updateError,
  } = useMutation({
    mutationFn: async (args) => {
      try {
        return await updateTestDriveStatus(args.id, args.status);
      } catch (err) {
        console.error("Update error:", err);
        throw err;
      }
    },
  });

  // 3. Cancel Booking
  const {
    mutate: cancelBookingFn,
    isPending: cancelling,
    data: cancelResult,
    error: cancelError,
  } = useMutation({
    mutationFn: async (bookingId) => {
      try {
        return await cancelTestDrive(bookingId);
      } catch (err) {
        console.error("Cancel error:", err);
        throw err;
      }
    },
  });

  // Initial fetch and on filter change
  useEffect(() => {
    fetchTestDrives({ search, status: statusFilter });
  }, [search, statusFilter]);

  // Handle results
  useEffect(() => {
    if (updateResult?.success) {
      toast.success("Test drive status updated");
      fetchTestDrives({ search, status: statusFilter });
    } else if (updateError) {
      toast.error("Failed to update test drive status");
    }

    if (cancelResult?.success) {
      toast.success("Test drive cancelled");
      fetchTestDrives({ search, status: statusFilter });
    } else if (cancelError) {
      toast.error("Failed to cancel test drive");
    }

    if (testDrivesError) {
      toast.error("Failed to fetch test drives");
    }
  }, [updateResult, cancelResult, cancelError, testDrivesError, updateError]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTestDrives({ search, status: statusFilter });
  };

  const handleUpdateStatus = (id, newStatus) => {
    if (newStatus) {
      updateStatus({ id, status: newStatus });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 w-full items-start sm:items-center justify-between">
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value === "ALL" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="NO_SHOW">No Show</SelectItem>
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
            Manage all test drive reservations and update their status
          </CardDescription>
          <CardAction />
        </CardHeader>
        <CardContent>
          {fetchingTestDrives && !testDrivesData ? (
            <div className="flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-4">
              {!testDrivesData?.data?.length ? (
                <div className="text-center py-10 text-gray-500">
                  No bookings found.
                </div>
              ) : (
                testDrivesData.data.map((booking) => (
                  <div key={booking.id} className="relative">
                    <TestDriveCard
                      booking={booking}
                      onCancel={async (bookingId) => {
                        try {
                          cancelBookingFn(bookingId);
                        } catch (err) {
                          toast.error("Unexpected cancel error");
                        }
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
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestDriveList;
