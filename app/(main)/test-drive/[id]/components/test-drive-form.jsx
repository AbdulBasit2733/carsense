"use client";
import { bookTestDrive } from "@/actions/test-drive";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Car, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const testDriveSchema = z.object({
  date: z.date({
    required_error: "Please select a date for your test drive",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot",
  }),
  notes: z.string().optional(),
});

const TestDriveForm = ({ car, testDriveInfo }) => {
  // console.log("car", car);
  // console.log("test", testDriveInfo);

  const router = useRouter();
  const [availableTimeSlot, setAvailableTimeSlot] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const {
    mutate: bookTestDriveFn,
    isPending: bookingInProgress,
    data: bookingResult,
    error: bookingError,
  } = useMutation({
    mutationFn: bookTestDrive,
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(testDriveSchema),
    defaultValues: {
      date: undefined,
      timeSlot: undefined,
      notes: "",
    },
  });

  const dealership = testDriveInfo?.dealership;
  // console.log("testdriveinfo", testDriveInfo);

  const existingBookings = testDriveInfo?.existingBookings || [];
  const selectedDate = watch("date");

  const isDayDisabled = (day) => {
    if (day < new Date()) {
      return true;
    }
    const dayOfWeek = format(day, "EEEE").toUpperCase();

    const daySchedule = dealership?.workingHours?.find(
      (schedule) => schedule.dayOfWeek === dayOfWeek
    );
    return !daySchedule || !daySchedule.isOpen;
  };
  useEffect(() => {
    if (!selectedDate || !dealership?.workingHours) return;
    const selectedDayOfWeek = format(selectedDate, "EEEE").toUpperCase();
    const daySchedule = dealership.workingHours.find(
      (day) => day.dayOfWeek === selectedDayOfWeek
    );
    if (!daySchedule || !daySchedule.isOpen) {
      setAvailableTimeSlot([]);
      return;
    }
    const openHour = daySchedule?.openTime
      ? parseInt(String(daySchedule.openTime).split(":")[0])
      : 0;

    const closeHour = daySchedule?.closeTime
      ? parseInt(String(daySchedule.closeTime).split(":")[0])
      : 0;

    const slots = [];
    for (let hour = openHour; hour < closeHour; hour++) {
      const startTime = `${hour.toString().padStart(2, "0")}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;

      const isBooked = existingBookings.some((booking) => {
        const bookingDate = booking.date;
        return (
          bookingDate === format(selectedDate, "yyyy-MM-dd") &&
          (booking.startTime === startTime || booking.endTime === endTime)
        );
      });
      if (!isBooked) {
        slots.push({
          id: `${startTime}-${endTime}`,
          label: `${startTime}-${endTime}`,
          startTime,
          endTime,
        });
      }
    }

    setAvailableTimeSlot(slots);
    setValue("timeSlot", "");
  }, [selectedDate]);
  useEffect(() => {
    if (bookingResult?.success) {
      setBookingDetails({
        date: bookingResult?.data?.bookingDate
          ? format(
              parseISO(bookingResult?.data?.bookingDate.toISOString()),
              "EEEE, MMMM d, yyyy"
            )
          : "",
        timeSlot: `${format(
          parseISO(`2022-01-01T${bookingResult?.data?.startTime}`),
          "h:mm:a"
        )} - ${format(
          parseISO(`2022-01-01T${bookingResult?.data?.endTime}`),
          "h:mm:a"
        )}`,

        notes: bookingResult?.data?.notes ?? "",
      });
      setShowConfirmation(true);
      reset();
    }
  }, [bookingResult]);

  useEffect(() => {
    if (bookingError) {
      toast.error(
        bookingError.message || "Failed to book test drive.Please try again"
      );
    }
  }, [bookingError]);

  const onSubmit = async (data) => {
    const selectedSlot = availableTimeSlot.find(
      (slot) => slot.id === data.timeSlot
    );
    if (!selectedSlot) {
      toast.error("Selected Time Slot is not available");
    }
    await bookTestDriveFn({
      carId: car.id,
      bookingDate: format(data.date, "yyyy-MM-dd"),
      startTime: selectedSlot?.startTime ?? "",
      endTime: selectedSlot?.endTime ?? "",
      notes: data.notes || "",
    });
  };
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    router.push(`/cars/${car.id}`);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className=" md:col-span-1">
        <Card>
          {/* <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader> */}
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Car Details</h2>
            <div className="aspect-video rounded-lg overflow-hidden relative mb-4">
              {car.images && car.images.length > 0 ? (
                <img
                  src={car.images[0]}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Car className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <h3 className="text-lg font-bold">
              {car.year} {car.make} {car.model}
            </h3>
            <div className="mt-2 text-xl font-bold text-blue-600">
              ${car.price.toLocaleString()}
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <div className="flex justify-between py-1 border-b">
                <span>Mileage</span>
                <span className="font-medium">
                  {car.mileage.toLocaleString()} miles
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Fuel Type</span>
                <span className="font-medium">{car.fuelType}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Transmission</span>
                <span className="font-medium">{car.transmission}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Body Type</span>
                <span className="font-medium">{car.bodyType}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Color</span>
                <span className="font-medium">{car.color}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Dealership Info */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Dealership Info</h2>
            <div className="text-sm">
              <p className="font-medium">
                {dealership?.name || "Vehiql Motors"}
              </p>
              <p className="text-gray-600 mt-1">
                {dealership?.address || "Address not available"}
              </p>
              <p className="text-gray-600 mt-3">
                <span className="font-medium">Phone:</span>{" "}
                {dealership?.phone || "Not available"}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Email:</span>{" "}
                {dealership?.email || "Not available"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className=" md:col-span-2">
        <Card>
          <CardContent>
            <h2 className="text-xl font-bold mb-6">
              {" "}
              Schedule your test drive
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label className=" block text-sm font-medium ">
                  Select a Date
                </Label>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => {
                    return (
                      <div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              disabled={isDayDisabled}
                              className="rounded-md border"
                            />
                          </PopoverContent>
                        </Popover>

                        {errors.date && (
                          <p className="text-sm font-medium mt-1 text-red-500">
                            {errors.date.message}
                          </p>
                        )}
                      </div>
                    );
                  }}
                />
              </div>
              <div className=" space-y-2">
                <label className="block text-sm font-medium">
                  Select a Time Slot
                </label>
                <Controller
                  name="timeSlot"
                  control={control}
                  render={({ field }) => {
                    return (
                      <div>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={
                            !selectedDate || availableTimeSlot.length === 0
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                !selectedDate
                                  ? "Please select a date first"
                                  : availableTimeSlot.length === 0
                                  ? "No Available slots on this date"
                                  : "Select a time slot"
                              }
                            ></SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {availableTimeSlot.map((slot) => (
                              <SelectItem key={slot.id} value={slot.id}>
                                {slot.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {errors.timeSlot && (
                          <p className="text-sm font-medium mt-1 text-red-500">
                            {errors.timeSlot.message}
                          </p>
                        )}
                      </div>
                    );
                  }}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Additional Notes (Optional)
                </label>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder=" specific questions or requests for your test drive?"
                      className="min-h-24"
                    />
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={bookingInProgress}
              >
                {bookingInProgress ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking Your Test Drive...
                  </>
                ) : (
                  "Book Test Drive"
                )}
              </Button>
            </form>
            {/* Instructions */}
            <div className="mt-8 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">What to expect</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  Bring your driver's license for verification
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  Test drives typically last 30-60 minutes
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  A dealership representative will accomp you
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Test Drive Booked Successfully
            </DialogTitle>
            <DialogDescription>
              Your Test Drive has been confirmed with the following details:
            </DialogDescription>
          </DialogHeader>
          {bookingDetails && (
            <div className="py-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Car:</span>
                  <span>
                    {car.year} {car.make} {car.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  {/*  */}
                  <span>{bookingDetails.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Time Slot:</span>
                  {/*  */}
                  <span>{bookingDetails.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Dealership:</span>
                  <span>{dealership?.name || "Vehiql Motors"}</span>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 p-3 rounded text-sm text-blue-700">
                Please arrive 10 minutes early with your driver's license.
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleCloseConfirmation}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestDriveForm;
