"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import {
  Clock,
  Loader2,
  Save,
  Search,
  Shield,
  User,
  UserX,
} from "lucide-react";
// import useFetch from "@/hooks/use-fetch";
import {
  getDealershipInfo,
  getUsers,
  saveWorkingHours,
  updateUserRole,
} from "@/actions/settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Day names for display
const DAYS = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];

export interface WorkingHour {
  id: string;
  dealershipId: string;
  dayOfWeek: string; // e.g., "MONDAY"
  openTime: string; // e.g., "09:00"
  closeTime: string; // e.g., "18:00"
  isOpen: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface DealershipInfo {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  workingHours: WorkingHour[];
}

export interface UserProps {
  id: string;
  clerkUserId: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
  phone: string | null;
  role: "ADMIN" | "USER"; // you can adjust roles as per your app
  createdAt: string;
  updatedAt: string;
}

export interface DealershipInfoResponse {
  success: boolean;
  data: DealershipInfo;
}

export interface UsersResponse {
  success: boolean;
  data: UserProps[];
}

export interface WorkingHour {
  id: string;
  dealershipId: string;
  dayOfWeek: string; // e.g., "MONDAY"
  openTime: string;  // e.g., "09:00"
  closeTime: string; // e.g., "18:00"
  isOpen: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface DealershipSettings {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  workingHours: WorkingHour[];
}

export interface DealershipSettingsResponse {
  success: boolean;
  data: DealershipSettings;
}


const SettingsForm = () => {
  const queryClient = useQueryClient();

  const [workingHours, setWorkingHours] = useState(
    DAYS.map((day) => ({
      dayOfWeek: day.value,
      openTime: "09:00",
      closeTime: "18:00",
      isOpen: day.value !== "SUNDAY",
    }))
  );
  const [userSearch, setUserSearch] = useState("");

  const {
    data: settingsData,
    error: settingsError,
    isLoading: fetchingSettings,
  } = useQuery({
    queryKey: ["dealership-info"],
    queryFn: getDealershipInfo,
  });

  const {
    data: usersData,
    error: usersError,
    isLoading: fetchingUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const {
    mutate: saveHours,
    isPending: savingHours,
    data: saveResult,
    error: saveError,
  } = useMutation({
    mutationFn: saveWorkingHours,
    onSuccess: () => {
      toast.success("Working Hours saved successfully");
      queryClient.invalidateQueries({ queryKey: ["dealership-info"] });
    },
    onError: (error: any) => {
      toast.error(`Failed to save working hours: ${error.message}`);
    },
  });

  const {
    mutate: updateRole,
    isPending: updatingRole,
    data: updateRoleResult,
    error: updateRoleError,
  } = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      updateUserRole(userId, role),
    onSuccess: () => {
      toast.success("User role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update user role: ${error.message}`);
    },
  });

  const handleWorkingHourChange = (
      index: number,
      field: string,
      value: string | boolean
    ) => {
      const updatedHours = [...workingHours];
      updatedHours[index] = {
        ...updatedHours[index],
        [field]: value,
      };
      setWorkingHours(updatedHours);
    };

  const handleSaveHours = () => {
    saveHours(workingHours);
  };

  const handleRemoveAdmin = (user: UserProps) => {
    if (
      confirm(
        `Are you sure you want to remove admin privileges to ${
          user.name || user.email
        }? They will no longer be able to access the admin dashboard.`
      )
    ) {
      updateRole({ userId: user.id, role: "USER" });
    }
  };

  const handleMakeAdmin = (user: UserProps) => {
    if (
      confirm(
        `Are you sure you want to give admin privileges to ${
          user.name || user.email
        }? Admin users can manage all aspects of the dealership.`
      )
    ) {
      updateRole({ userId: user.id, role: "ADMIN" });
    }
  };

  useEffect(() => {
    if (settingsData && settingsData.success && settingsData.data) {
      const dealership: DealershipInfo = settingsData.data;
      if (dealership?.workingHours !== null) {
        const mappedHours = DAYS.map((day) => {
          const hourData = dealership.workingHours.find(
            (h) => h.dayOfWeek === day.value
          );
          if (hourData) {
            return {
              dayOfWeek: hourData.dayOfWeek,
              openTime: hourData.openTime,
              closeTime: hourData.closeTime,
              isOpen: hourData.isOpen,
            };
          }
          return {
            dayOfWeek: day.value,
            openTime: "09:00",
            closeTime: "18:00",
            isOpen: day.value !== "SUNDAY",
          };
        });
        setWorkingHours(mappedHours);
      }
    }
  }, [settingsData]);

  const filteredUser =
    usersData && usersData?.data
      ? usersData?.data?.filter(
          (user) =>
            user.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearch.toLowerCase())
        )
      : [];

  useEffect(() => {
    if (settingsError) toast.error("Failed to load dealership settings");
    if (saveError)
      toast.error(`Failed to save working hours: ${saveError.message}`);
    if (usersError) toast.error("Failed to load users");
    if (updateRoleError)
      toast.error(`Failed to update user role: ${updateRoleError.message}`);
  }, [settingsError, saveError, usersError, updateRoleError]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="hours" className="">
        <TabsList>
          <TabsTrigger value="hours">
            <Clock className="h-4 w-4 mr-2" />
            Working Hours
          </TabsTrigger>
          <TabsTrigger value="admins">
            <Shield className="h-4 w-4 mr-2" />
            Admin Users
          </TabsTrigger>
        </TabsList>
        <TabsContent value="hours" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Working Hours</CardTitle>
              <CardDescription>
                Set your dealership's working hours for each day of the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DAYS.map((day, index) => {
                  return (
                    <div
                      key={day.value}
                      className="grid grid-cols-12 gap-4 items-center py-3 px-4 rounded-lg hover:bg-slate-50"
                    >
                      <div className=" col-span-3 md:col-span-2">
                        <div className="font-medium">{day.label}</div>
                      </div>
                      <div className="col-span-9 md:col-span-2 flex items-center">
                        <Checkbox
                          id={`is-open-${day.value}`}
                          checked={workingHours[index]?.isOpen}
                          onCheckedChange={(checked) =>
                            handleWorkingHourChange(index, "isOpen", checked)
                          }
                        />
                        <Label
                          htmlFor={`is-open-${day.value}`}
                          className="ml-2 cursor-pointer"
                        >
                          {workingHours[index]?.isOpen ? "Open" : "Closed"}
                        </Label>
                      </div>
                      {workingHours[index].isOpen && (
                        <>
                          <div className=" col-span-5 md:col-span-4">
                            <div className=" flex items-center">
                              <Clock className="h-4 w-4 text-gray-400 mr-2" />
                              <Input
                                type="time"
                                value={workingHours[index]?.openTime}
                                onChange={(e) =>
                                  handleWorkingHourChange(
                                    index,
                                    "openTime",
                                    e.target.value
                                  )
                                }
                                className="text-sm"
                              />
                            </div>
                          </div>
                          <div className="text-center col-span-1">To</div>
                          <div className=" col-span-5 md:col-span-3">
                            <Input
                              type="time"
                              value={workingHours[index]?.closeTime}
                              onChange={(e) =>
                                handleWorkingHourChange(
                                  index,
                                  "closeTime",
                                  e.target.value
                                )
                              }
                              className="text-sm"
                            />
                          </div>
                        </>
                      )}
                      {!workingHours[index]?.isOpen && (
                        <div className="col-span-11 md:col-span-8 text-gray-500 italic text-sm">
                          Closed all day
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-end">
                <Button disabled={savingHours} onClick={handleSaveHours}>
                  {savingHours ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Working Hours
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>
                Manage users with admin privileges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  value={userSearch}
                  onChange={(e) => setUserSearch(e?.target?.value)}
                  type="Search"
                  placeholder="Search users..."
                  className="pl-9 w-full"
                />
              </div>
              {fetchingUsers ? (
                <div className="py-12 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : usersData && usersData?.data && filteredUser.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUser?.map((user) => {
                        return (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative">
                                  {user.imageUrl ? (
                                    <img
                                      src={user.imageUrl}
                                      alt={user.name || "User"}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <User className="h-4 w-4 text-gray-500" />
                                  )}
                                </div>
                                <span>{user.name || "Unnamed User"}</span>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  user.role === "ADMIN"
                                    ? "bg-green-800"
                                    : "bg-gray-800"
                                }
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {user.role === "ADMIN" ? (
                                <Button
                                  variant={"outline"}
                                  size={"sm"}
                                  className="text-red-600"
                                  onClick={() => handleRemoveAdmin(user)}
                                  disabled={updatingRole}
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Remove Admin
                                </Button>
                              ) : (
                                <Button
                                  variant={"outline"}
                                  size={"sm"}
                                  onClick={() => handleMakeAdmin(user)}
                                  disabled={updatingRole}
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Make Admin
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </>
              ) : (
                <div className="py-12 text-center">
                  <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No users found
                  </h3>
                  <p className="text-gray-500">
                    {userSearch
                      ? "No users match your search criteria"
                      : "There are no users registered yet"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsForm;
