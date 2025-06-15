import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[200px] md:grid-cols-3 lg:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  id,
  description,
  header,
  icon,
  price,
  year,
  transmission,
  fuelType,
  isLarge = false,
}: {
  className?: string;
  title?: string;
  id:string;
  description?: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  price?: number;
  year?: number;
  transmission?: string;
  fuelType?: string;
  isLarge?: boolean;
}) => {
  return (
    <div
      className={cn(
        "group/bento relative overflow-hidden rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 transition duration-300 hover:scale-[1.02]",
        isLarge ? "row-span-2" : "row-span-1",
        className,
      )}
    >
      <Link href={`/cars/${id}`}>
      {/* Car Image */}
      {typeof icon === 'string' && (
        <div className="relative h-full w-full">
          <Image 
            src={icon} 
            alt={typeof title === 'string' ? title : 'Car image'}
            fill
            className="object-cover"
            />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
      )}
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
        {/* Top badges */}
        <div className="flex items-start justify-between">
          <div className="flex gap-2">
            {year && (
              <span className="rounded bg-orange-600 px-2 py-1 text-xs font-semibold">
                {year}
              </span>
            )}
            {transmission && (
              <span className="rounded bg-neutral-600/80 px-2 py-1 text-xs">
                {transmission}
              </span>
            )}
            {fuelType && (
              <span className="rounded bg-neutral-600/80 px-2 py-1 text-xs">
                {fuelType}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-full bg-white/20 p-1.5 backdrop-blur-sm transition hover:bg-white/30">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.682l-1.318-1.364a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <span className="flex items-center gap-1 text-sm">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              7
            </span>
          </div>
        </div>

        {/* Bottom content */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold leading-tight">
            {title}
          </h3>
          {price && (
            <p className="text-2xl font-bold">
              ${price.toLocaleString()}
            </p>
          )}
        </div>
      </div>
          </Link>
    </div>
  );
};
