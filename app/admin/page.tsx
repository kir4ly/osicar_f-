"use client";

import { useState, useEffect } from "react";
import { supabase, CarData } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("hu-HU").format(price);
}

export default function AdminPage() {
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCar, setEditingCar] = useState<CarData | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuel: "benzin",
    transmission: "automata",
    power: 0,
    color: "",
    description: "",
    features: "",
    images: "",
    featured: false,
  });

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    setLoading(true);
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching cars:", error);
    } else {
      setCars(data || []);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const carData = {
      brand: formData.brand,
      model: formData.model,
      year: formData.year,
      price: formData.price,
      mileage: formData.mileage,
      fuel: formData.fuel,
      transmission: formData.transmission,
      power: formData.power,
      color: formData.color,
      description: formData.description,
      features: formData.features.split(",").map((f) => f.trim()).filter(Boolean),
      images: formData.images.split(",").map((i) => i.trim()).filter(Boolean),
      featured: formData.featured,
    };

    let error;
    if (editingCar) {
      const { error: updateError } = await supabase
        .from("cars")
        .update(carData)
        .eq("id", editingCar.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("cars")
        .insert([carData]);
      error = insertError;
    }

    if (error) {
      console.error("Error saving car:", error);
      alert("Hiba történt a mentés során: " + error.message);
    } else {
      resetForm();
      fetchCars();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Biztosan törli ezt az autót?")) return;

    const { error } = await supabase.from("cars").delete().eq("id", id);

    if (error) {
      console.error("Error deleting car:", error);
      alert("Hiba történt a törlés során");
    } else {
      fetchCars();
    }
  }

  function handleEdit(car: CarData) {
    setEditingCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      fuel: car.fuel,
      transmission: car.transmission,
      power: car.power,
      color: car.color,
      description: car.description,
      features: car.features.join(", "),
      images: car.images.join(", "),
      featured: car.featured,
    });
    setShowForm(true);
  }

  function resetForm() {
    setEditingCar(null);
    setFormData({
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      fuel: "benzin",
      transmission: "automata",
      power: 0,
      color: "",
      description: "",
      features: "",
      images: "",
      featured: false,
    });
    setShowForm(false);
  }

  return (
    <div className="grain-overlay min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4 animate-fade-up">
            Adminisztráció
          </p>
          <h1 className="text-display-xl animate-fade-up delay-100">
            Autó kezelés
          </h1>
        </div>

        <div className="flex gap-4 mb-12 animate-fade-up delay-200">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center justify-center h-14 px-10 bg-primary text-primary-foreground text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors duration-300"
          >
            Új autó hozzáadása
          </button>
        </div>

        {showForm && (
          <div className="border border-foreground/10 p-8 mb-12 animate-fade-up">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-display-md">
                {editingCar ? "Autó szerkesztése" : "Új autó"}
              </h2>
              <button
                onClick={resetForm}
                className="text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                Bezárás
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm uppercase tracking-widest text-muted-foreground mb-3 block">
                    Márka
                  </label>
                  <Input
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    placeholder="pl. BMW"
                    required
                    className="h-14 bg-transparent border-foreground/10 text-lg"
                  />
                </div>
                <div>
                  <label className="text-sm uppercase tracking-widest text-muted-foreground mb-3 block">
                    Modell
                  </label>
                  <Input
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    placeholder="pl. 320d xDrive"
                    required
                    className="h-14 bg-transparent border-foreground/10 text-lg"
                  />
                </div>
                <div>
                  <label className="text-sm uppercase tracking-widest text-muted-foreground mb-3 block">
                    Évjárat
                  </label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: parseInt(e.target.value) })
                    }
                    min={1990}
                    max={new Date().getFullYear() + 1}
                    required
                    className="h-14 bg-transparent border-foreground/10 text-lg"
                  />
                </div>
                <div>
                  <label className="text-sm uppercase tracking-widest text-muted-foreground mb-3 block">
                    Ár (Ft)
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseInt(e.target.value) })
                    }
                    min={0}
                    required
                    className="h-14 bg-transparent border-foreground/10 text-lg"
                  />
                </div>
                <div>
                  <label className="text-sm uppercase tracking-widest text-muted-foreground mb-3 block">
                    Kilométer
                  </label>
                  <Input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) =>
                      setFormData({ ...formData, mileage: parseInt(e.target.value) })
                    }
                    min={0}
                    required
                    className="h-14 bg-transparent border-foreground/10 text-lg"
                  />
                </div>
                <div>
                  <label className="text-sm uppercase tracking-widest text-muted-foreground mb-3 block">
                    Teljesítmény (LE)
                  </label>
                  <Input
                    type="number"
                    value={formData.power}
                    onChange={(e) =>
                      setFormData({ ...formData, power: parseInt(e.target.value) })
                    }
                    min={0}
                    required
                    className="h-14 bg-transparent border-foreground/10 text-lg"
                  />
                </div>
                <div>
                  <label className="text-sm uppercase tracking-widest text-muted-foreground mb-3 block">
                    Üzemanyag
                  </label>
                  <Select
                    value={formData.fuel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, fuel: value })
                    }
                  >
                    <SelectTrigger className="h-14 bg-transparent border-foreground/10 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="benzin">Benzin</SelectItem>
                      <SelectItem value="dízel">Dízel</SelectItem>
                      <SelectItem value="elektromos">Elektromos</SelectItem>
                      <SelectItem value="hibrid">Hibrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm uppercase tracking-widest text-muted-foreground mb-3 block">
                    Váltó
                  </label>
                  <Select
                    value={formData.transmission}
                    onValueChange={(value) =>
                      setFormData({ ...formData, transmission: value })
                    }
                  >
                    <SelectTrigger className="h-14 bg-transparent border-foreground/10 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manuális">Manuális</SelectItem>
                      <SelectItem value="automata">Automata</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm uppercase tracking-widest text-muted-foreground mb-3 block">
                    Szín
                  </label>
                  <Input
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    placeholder="pl. Fekete"
                    required
                    className="h-14 bg-transparent border-foreground/10 text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm uppercase tracking-widest text-muted-foreground mb-3 block">
                  Leírás
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Autó részletes leírása..."
                  rows={4}
                  required
                  className="bg-transparent border-foreground/10 text-lg resize-none"
                />
              </div>

              <div>
                <label className="text-sm uppercase tracking-widest text-muted-foreground mb-3 block">
                  Felszereltség (vesszővel elválasztva)
                </label>
                <Input
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  placeholder="pl. Bőr ülések, Navigáció, LED fényszórók"
                  className="h-14 bg-transparent border-foreground/10 text-lg"
                />
              </div>

              <div>
                <label className="text-sm uppercase tracking-widest text-muted-foreground mb-3 block">
                  Képek URL-jei (vesszővel elválasztva)
                </label>
                <Input
                  value={formData.images}
                  onChange={(e) =>
                    setFormData({ ...formData, images: e.target.value })
                  }
                  placeholder="pl. https://example.com/image1.jpg, https://example.com/image2.jpg"
                  className="h-14 bg-transparent border-foreground/10 text-lg"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="w-5 h-5"
                />
                <label htmlFor="featured" className="text-lg">
                  Kiemelt autó (megjelenik a főoldalon)
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center h-14 px-10 bg-primary text-primary-foreground text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50"
                >
                  {saving ? "Mentés..." : editingCar ? "Mentés" : "Hozzáadás"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center h-14 px-10 border border-foreground/20 text-sm uppercase tracking-widest hover:bg-foreground/5 transition-colors duration-300"
                >
                  Mégse
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <p className="text-display-md text-muted-foreground">Betöltés...</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-display-md text-muted-foreground mb-4">
              Még nincsenek autók az adatbázisban
            </p>
            <p className="text-muted-foreground">
              Kattintson az &quot;Új autó hozzáadása&quot; gombra az első autó feltöltéséhez.
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-up delay-300">
            <p className="text-sm text-muted-foreground mb-8">
              {cars.length} autó az adatbázisban
            </p>
            <div className="grid gap-4">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className="border border-foreground/10 p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
                >
                  <div className="flex-1">
                    <h3 className="text-display-md mb-1">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-muted-foreground">
                      {car.year} / {car.mileage.toLocaleString("hu-HU")} km /{" "}
                      {car.fuel} / {car.transmission}
                    </p>
                    <p className="text-primary text-lg mt-2">
                      {formatPrice(car.price)} Ft
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(car)}
                      className="h-10 px-6 border border-foreground/20 text-sm uppercase tracking-widest hover:bg-foreground/5 transition-colors duration-300"
                    >
                      Szerkesztés
                    </button>
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="h-10 px-6 border border-red-500/50 text-red-500 text-sm uppercase tracking-widest hover:bg-red-500/10 transition-colors duration-300"
                    >
                      Törlés
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
