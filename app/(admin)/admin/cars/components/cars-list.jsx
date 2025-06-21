"use client";
import { deleteCar, getCars, updateCarStatus } from "@/actions/cars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation } from "@tanstack/react-query";
import {
  CarIcon,
  Eye,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";


const CarsList = () => {
  const [search, setSearch] = useState("");
  const [carToDelete, setCarToDelete] = useState(null);
  const [deleteDiaglogOpen, setDeleteDialogOpen] = useState(false);

  const router = useRouter();

  // Fetch Cars
  const {
    mutate: fetchCarsFn,
    data: carsData,
    isPending: carsLoading,
    error: carsError,
  } = useMutation({
    mutationFn: async () => {
      const res = await getCars({ search });
      if (res.success && res.data) {
        return res;
      }
      return {
        success: false,
        data: [],
      };
    },
  });

  // console.log("Admin cars data", carsData);

  // Delete Car
  const {
    mutate: deleteCarFn,
    data: deleteResult,
    isPending: deletingcar,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteCar,
  });

  // Update Car Status
  const {
    mutate: updateCarFn,
    data: updateResult,
    isPending: updatingCar,
    error: updateError,
  } = useMutation({
    mutationFn: ({ id, payload }) =>
      updateCarStatus(id, payload),
  });

  // handle mutation success
  useEffect(() => {
    if (deleteResult?.success) {
      toast.success("Car deleted successfully");
    }
    if (updateResult?.success) {
      toast.success("Car status updated successfully");
    } else if (!updateResult?.success) {
      toast.error(`Error: ${updateResult?.message}`);
    }

    fetchCarsFn();
  }, [deleteResult, updateResult]);

  // handle mutation errors
  useEffect(() => {
    if (carsError) toast.error(`Error: ${carsError}`);
    if (deleteError) toast.error(`Error: ${deleteError}`);
    if (updateError) toast.error(`Error: ${updateError}`);
  }, [carsError, deleteError, updateError]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCarsFn();
  };

  const handleDeleteCar = async () => {
    if (!carToDelete) return;
    deleteCarFn(carToDelete.id);
    setDeleteDialogOpen(false);
    setCarToDelete(null);
  };

  const handleToggleFeatured = async (car) => {
    updateCarFn({ id: car.id, payload: { featured: !car.featured } });
  };

  const handleStatusUpdate = async (car, newStatus) => {
    updateCarFn({ id: car.id, payload: { status: newStatus } });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            AVAILABLE
          </Badge>
        );
      case "UNAVAILABLE":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            UNAVAILABLE
          </Badge>
        );
      case "SOLD":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            SOLD
          </Badge>
        );
      default:
        return <Badge variant={"outline"}>{status}</Badge>;
    }
  };

  return (
    <div className=" space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Button
          onClick={() => router.push("/admin/cars/create")}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Car
        </Button>
        <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="search cars"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full sm:w-60"
            />
          </div>
        </form>
      </div>
      <Card>
        <CardContent className="p-0">
          {!carsData?.success && carsData?.data?.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No cars found.
            </div>
          ) : carsLoading ? (
            <div>
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : carsData && carsData?.data?.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Invoice</TableHead>
                    <TableHead>Make & Model</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                {carsData?.data && carsData?.data?.length > 0 ? (
                  <TableBody>
                    {carsData.data &&
                      carsData.data?.map((car) => (
                        <TableRow key={car.id}>
                          <TableCell className="w-10 h-10 rounded-md overflow-hidden">
                            {car.images && car.images.length > 0 ? (
                              <Image
                                src={car.images[0]}
                                alt={`${car.make} ${car.model}`}
                                height={40}
                                width={40}
                                className="w-full h-full object-cover"
                                priority
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <CarIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </TableCell>

                          {/* Make & Model */}
                          <TableCell>
                            {car.make} {car.model}
                          </TableCell>

                          {/* Year */}
                          <TableCell>{car.year}</TableCell>

                          {/* Price */}
                          <TableCell>{`$${car.price.toLocaleString()}`}</TableCell>

                          {/* Status */}
                          <TableCell>{getStatusBadge(car.status)}</TableCell>

                          {/* Featured */}
                          <TableCell>
                            <Button
                              disabled={updatingCar}
                              variant={"ghost"}
                              size={"sm"}
                              className="p-0 h-9 w-9"
                              onClick={() => handleToggleFeatured(car)}
                            >
                              {car.featured ? (
                                <Star className="text-amber-500 fill-amber-500 h-5 w-5" />
                              ) : (
                                <StarOff className="text-gray-400 h-5 w-5" />
                              )}
                            </Button>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant={"ghost"}
                                  size={"sm"}
                                  className="p-0 h-8 w-8"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => router.push(`/cars/${car.id}`)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Status</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusUpdate(car, "AVAILABLE")
                                  }
                                  disabled={
                                    car.status === "AVAILABLE" || updatingCar
                                  }
                                >
                                  Set AVAILABLE
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusUpdate(car, "UNAVAILABLE")
                                  }
                                  disabled={
                                    car.status === "UNAVAILABLE" || updatingCar
                                  }
                                >
                                  Set UNAVAILABLE
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusUpdate(car, "SOLD")
                                  }
                                  disabled={
                                    car.status === "SOLD" || updatingCar
                                  }
                                >
                                  Mark as SOLD
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setCarToDelete(car);
                                    setDeleteDialogOpen(true);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                ) : (
                  <TableBody>
                    {/* Optional: You can show a skeleton or "Loading..." */}
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading cars...
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </div>
          ) : (
            <div></div>
          )}
        </CardContent>
      </Card>
      <Dialog open={deleteDiaglogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>

            <DialogDescription>
              {/*  */}
              Are you sure you want to delete {carToDelete?.make} {/*  */}
              {carToDelete?.model} ({carToDelete?.year})? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={"outline"}
              disabled={deletingcar}
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={"destructive"}
              disabled={deletingcar}
              onClick={handleDeleteCar}
            >
              {deletingcar ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Car"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarsList;
