import { memo } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, GaugeIcon, FuelIcon, CogIcon } from "lucide-react";
import type { Car } from "@/lib/data";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("hu-HU").format(price) + " Ft";
}

function formatMileage(mileage: number): string {
  return new Intl.NumberFormat("hu-HU").format(mileage) + " km";
}

export const CarCard = memo(function CarCard({ car }: { car: Car }) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-[16/10] bg-muted overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20">
          <span className="text-4xl font-bold text-primary/20">
            {car.brand}
          </span>
        </div>
        {car.featured && (
          <Badge className="absolute top-3 left-3">Kiemelt</Badge>
        )}
      </div>
      <CardContent className="pt-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg">
            {car.brand} {car.model}
          </h3>
          <p
            className="text-2xl font-bold text-primary"
            style={{
              textShadow: '0 0 10px rgba(52, 118, 234, 0.5), 0 0 20px rgba(52, 118, 234, 0.3), 0 0 30px rgba(52, 118, 234, 0.2)'
            }}
          >{formatPrice(car.price)}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GaugeIcon className="h-4 w-4" />
            <span>{formatMileage(car.mileage)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FuelIcon className="h-4 w-4" />
            <span className="capitalize">{car.fuel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CogIcon className="h-4 w-4" />
            <span className="capitalize">{car.transmission}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/autok/${car.id}`}>Részletek megtekintése</Link>
        </Button>
      </CardFooter>
    </Card>
  );
});

CarCard.displayName = "CarCard";
