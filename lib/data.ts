export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: "benzin" | "dízel" | "elektromos" | "hibrid";
  transmission: "manuális" | "automata";
  color: string;
  power: number;
  engineSize: number;
  description: string;
  features: string[];
  images: string[];
  featured: boolean;
  sold?: boolean;
  isFromSupabase?: boolean;
}

export const cars: Car[] = [
  {
    id: "1",
    brand: "BMW",
    model: "320d xDrive",
    year: 2021,
    price: 14990000,
    mileage: 45000,
    fuel: "dízel",
    transmission: "automata",
    color: "Fekete",
    power: 190,
    engineSize: 2.0,
    description: "Kifogástalan állapotú BMW 320d xDrive, szervizelési előélettel, garázsban tartott. Első tulajdonostól.",
    features: ["Bőr ülések", "Navigáció", "LED fényszórók", "Tolatókamera", "Ülésfűtés", "Automata klíma"],
    images: ["/placeholder-car.jpg"],
    featured: true,
  },
  {
    id: "2",
    brand: "Mercedes-Benz",
    model: "C 200 AMG Line",
    year: 2022,
    price: 18500000,
    mileage: 28000,
    fuel: "benzin",
    transmission: "automata",
    color: "Fehér",
    power: 204,
    engineSize: 1.5,
    description: "AMG csomagos Mercedes C-osztály, panoráma tetővel, prémium hangrendszerrel.",
    features: ["AMG csomag", "Panoráma tető", "Burmester hangrendszer", "360° kamera", "Vezetéstámogató rendszerek"],
    images: ["/placeholder-car.jpg"],
    featured: true,
  },
  {
    id: "3",
    brand: "Audi",
    model: "A4 Avant 40 TDI",
    year: 2020,
    price: 12900000,
    mileage: 67000,
    fuel: "dízel",
    transmission: "automata",
    color: "Szürke",
    power: 190,
    engineSize: 2.0,
    description: "Családi kombi kiváló állapotban, S-line külsővel és nagy csomagtérrel.",
    features: ["S-line csomag", "Virtual Cockpit", "Matrix LED", "Elektromos csomagtér", "Tolatókamera"],
    images: ["/placeholder-car.jpg"],
    featured: true,
  },
  {
    id: "4",
    brand: "Volkswagen",
    model: "Golf 8 R-Line",
    year: 2023,
    price: 11500000,
    mileage: 12000,
    fuel: "benzin",
    transmission: "automata",
    color: "Kék",
    power: 150,
    engineSize: 1.5,
    description: "Szinte új Golf 8 R-Line csomaggal, teljes digitális műszerfallal.",
    features: ["R-Line csomag", "Digital Cockpit", "LED Plus fényszórók", "Adaptív tempomat", "Lane Assist"],
    images: ["/placeholder-car.jpg"],
    featured: false,
  },
  {
    id: "5",
    brand: "Toyota",
    model: "RAV4 Hybrid",
    year: 2022,
    price: 15900000,
    mileage: 35000,
    fuel: "hibrid",
    transmission: "automata",
    color: "Ezüst",
    power: 222,
    engineSize: 2.5,
    description: "Népszerű hibrid SUV, alacsony fogyasztással és megbízható technikával.",
    features: ["Hibrid hajtás", "AWD", "Toyota Safety Sense", "JBL hangrendszer", "Elektromos csomagtér"],
    images: ["/placeholder-car.jpg"],
    featured: true,
  },
  {
    id: "6",
    brand: "Skoda",
    model: "Octavia Combi RS",
    year: 2021,
    price: 10900000,
    mileage: 52000,
    fuel: "benzin",
    transmission: "automata",
    color: "Zöld",
    power: 245,
    engineSize: 2.0,
    description: "Sportos Octavia RS, DSG váltóval és Canton hangrendszerrel.",
    features: ["RS csomag", "Canton hangrendszer", "Virtual Cockpit", "Adaptív futómű", "Matrix LED"],
    images: ["/placeholder-car.jpg"],
    featured: false,
  },
  {
    id: "7",
    brand: "Tesla",
    model: "Model 3 Long Range",
    year: 2023,
    price: 19900000,
    mileage: 15000,
    fuel: "elektromos",
    transmission: "automata",
    color: "Fehér",
    power: 441,
    engineSize: 0,
    description: "Tesla Model 3 Long Range, 600+ km hatótávval és Autopilot funkcióval.",
    features: ["Autopilot", "Nagy hatótáv", "Prémium belső", "Üveg tető", "Gyorstöltés"],
    images: ["/placeholder-car.jpg"],
    featured: true,
  },
  {
    id: "8",
    brand: "Ford",
    model: "Focus ST",
    year: 2020,
    price: 8900000,
    mileage: 48000,
    fuel: "benzin",
    transmission: "manuális",
    color: "Narancs",
    power: 280,
    engineSize: 2.3,
    description: "Igazi hot-hatch, sportos karakterrel és remek vezetési élménnyel.",
    features: ["Recaro ülések", "Performance Pack", "B&O hangrendszer", "Sport kipufogó", "LSD differenciálmű"],
    images: ["/placeholder-car.jpg"],
    featured: false,
  },
];

export const brands = ["BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Toyota", "Skoda", "Tesla", "Ford"];
export const fuels = ["benzin", "dízel", "elektromos", "hibrid"];
export const transmissions = ["manuális", "automata"];
