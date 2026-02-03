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
import { Plus, X, Upload, Link as LinkIcon, Check, PackageCheck } from "lucide-react";

const ADMIN_PASSWORD = "osvath123";

async function triggerRevalidation() {
  try {
    await fetch("/api/revalidate", { method: "POST" });
  } catch (e) {
    console.error("Revalidation failed:", e);
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("hu-HU").format(price);
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

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
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("adminAuth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCars();
    }
  }, [isAuthenticated]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuth", "true");
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  }

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
      images: imageUrls,
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
      await triggerRevalidation();
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
      await triggerRevalidation();
    }
  }

  async function toggleSold(car: CarData) {
    const isCurrentlySold = car.sold;

    // Optimistic update
    setCars(prevCars =>
      prevCars.map(c =>
        c.id === car.id ? { ...c, sold: !isCurrentlySold } : c
      )
    );

    const { error } = await supabase
      .from("cars")
      .update({ sold: !isCurrentlySold })
      .eq("id", car.id);

    if (error) {
      console.error("Error toggling sold:", error);
      alert("Hiba történt az eladott státusz módosítása során");
      setCars(prevCars =>
        prevCars.map(c =>
          c.id === car.id ? { ...c, sold: isCurrentlySold } : c
        )
      );
    } else {
      await triggerRevalidation();
    }
  }

  async function toggleFulfilled(car: CarData) {
    const isCurrentlyFulfilled = car.fulfilled;

    // Optimistic update
    setCars(prevCars =>
      prevCars.map(c =>
        c.id === car.id ? { ...c, fulfilled: !isCurrentlyFulfilled } : c
      )
    );

    const { error } = await supabase
      .from("cars")
      .update({ fulfilled: !isCurrentlyFulfilled })
      .eq("id", car.id);

    if (error) {
      console.error("Error toggling fulfilled:", error);
      alert("Hiba történt a teljesítés státusz módosítása során");
      setCars(prevCars =>
        prevCars.map(c =>
          c.id === car.id ? { ...c, fulfilled: isCurrentlyFulfilled } : c
        )
      );
    } else {
      await triggerRevalidation();
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
    });
    setImageUrls(car.images || []);
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
    });
    setImageUrls([]);
    setNewImageUrl("");
    setShowForm(false);
  }

  function addImageUrl() {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  }

  function removeImageUrl(index: number) {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  }

  // Kép optimalizálás - átméretezés és tömörítés (mobil-barát)
  async function optimizeImage(file: File, maxWidth = 1600, quality = 0.75): Promise<Blob> {
    // createImageBitmap jól kezeli az EXIF orientációt és a legtöbb formátumot (HEIC is iOS-en)
    if (typeof createImageBitmap !== 'undefined') {
      try {
        const bitmap = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        let { width, height } = bitmap;

        // Max méret korlátozás (mobil memória miatt)
        const maxDimension = Math.max(width, height);
        if (maxDimension > maxWidth) {
          const scale = maxWidth / maxDimension;
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context not available');

        // Fehér háttér (átlátszóság helyett)
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(bitmap, 0, 0, width, height);
        bitmap.close();

        return await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
            'image/jpeg',
            quality
          );
        });
      } catch (e) {
        console.log('createImageBitmap failed, using fallback:', e);
        // Fallback to Image element method
      }
    }

    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        const maxDimension = Math.max(width, height);
        if (maxDimension > maxWidth) {
          const scale = maxWidth / maxDimension;
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(img.src);

        canvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image'));
      };
      img.src = URL.createObjectURL(file);
    });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const totalFiles = files.length;
    let uploadedCount = 0;

    for (const file of Array.from(files)) {
      try {
        setUploadProgress(`${uploadedCount + 1}/${totalFiles} feldolgozás...`);

        let uploadBlob: Blob;
        let contentType: string;
        let ext: string;

        try {
          uploadBlob = await optimizeImage(file);
          contentType = 'image/jpeg';
          ext = 'jpg';
        } catch (optimizeError) {
          console.log('Optimization failed, uploading original:', optimizeError);
          // Ha az optimalizálás nem sikerül (pl. HEIC nem támogatott), feltöltjük az eredetit
          uploadBlob = file;
          contentType = file.type || 'image/jpeg';
          ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
          // HEIC fájlok esetén próbáljuk JPEG-ként
          if (ext === 'heic' || ext === 'heif') {
            ext = 'jpg';
            contentType = 'image/jpeg';
          }
        }

        setUploadProgress(`${uploadedCount + 1}/${totalFiles} feltöltés...`);

        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
        const filePath = `car-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('Kepfeltoltes')
          .upload(filePath, uploadBlob, {
            contentType,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          alert(`Hiba a kép feltöltése során: ${uploadError.message}`);
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from('Kepfeltoltes')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          setImageUrls(prev => [...prev, publicUrlData.publicUrl]);
          uploadedCount++;
        }
      } catch (err) {
        console.error('Image upload error:', err);
        alert(`Hiba a kép feltöltése során: ${file.name}`);
      }
    }

    setUploadingImage(false);
    setUploadProgress("");
    e.target.value = '';

    if (uploadedCount > 0) {
      // Kis visszajelzés sikeres feltöltésről
      setUploadProgress(`${uploadedCount} kép feltöltve!`);
      setTimeout(() => setUploadProgress(""), 2000);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="grain-overlay min-h-screen pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="max-w-md mx-auto">
            <div className="mb-8 md:mb-16 text-center">
              <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2 md:mb-4 animate-fade-up">
                Adminisztráció
              </p>
              <h1 className="text-display-lg md:text-display-xl animate-fade-up delay-100">
                Bejelentkezés
              </h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 md:space-y-6 animate-fade-up delay-200">
              <div>
                <label className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-2 md:mb-3 block">
                  Jelszó
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="Adja meg a jelszót"
                  required
                  className={`h-12 md:h-14 bg-transparent border-foreground/10 text-base md:text-lg ${passwordError ? 'border-red-500' : ''}`}
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-2">Hibás jelszó</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center h-12 md:h-14 px-6 md:px-10 bg-primary text-primary-foreground text-xs md:text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors duration-300"
              >
                Belépés
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grain-overlay min-h-screen pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        <div className="mb-8 md:mb-16">
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2 md:mb-4 animate-fade-up">
            Adminisztráció
          </p>
          <h1 className="text-display-lg md:text-display-xl animate-fade-up delay-100">
            Autó kezelés
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-12 animate-fade-up delay-200">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center justify-center h-12 md:h-14 px-6 md:px-10 bg-primary text-primary-foreground text-xs md:text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors duration-300"
          >
            Új autó hozzáadása
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("adminAuth");
              setIsAuthenticated(false);
            }}
            className="inline-flex items-center justify-center h-12 md:h-14 px-6 md:px-10 border border-foreground/20 text-xs md:text-sm uppercase tracking-widest hover:bg-foreground/5 transition-colors duration-300"
          >
            Kijelentkezés
          </button>
        </div>

        {showForm && (
          <div className="border border-foreground/10 p-4 md:p-8 mb-8 md:mb-12 animate-fade-up">
            <div className="flex justify-between items-center mb-4 md:mb-8">
              <h2 className="text-lg md:text-display-md font-display uppercase">
                {editingCar ? "Autó szerkesztése" : "Új autó"}
              </h2>
              <button
                onClick={resetForm}
                className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                Bezárás
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-2 md:mb-3 block">
                    Márka
                  </label>
                  <Input
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    placeholder="pl. BMW"
                    required
                    className="h-12 md:h-14 bg-transparent border-foreground/10 text-base md:text-lg"
                  />
                </div>
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-2 md:mb-3 block">
                    Modell
                  </label>
                  <Input
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    placeholder="pl. 320d xDrive"
                    required
                    className="h-12 md:h-14 bg-transparent border-foreground/10 text-base md:text-lg"
                  />
                </div>
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-2 md:mb-3 block">
                    Évjárat
                  </label>
                  <Input
                    type="number"
                    value={formData.year || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value ? parseInt(e.target.value) : 0 })
                    }
                    min={1990}
                    max={new Date().getFullYear() + 1}
                    required
                    className="h-12 md:h-14 bg-transparent border-foreground/10 text-base md:text-lg"
                  />
                </div>
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-2 md:mb-3 block">
                    Ár (Ft)
                  </label>
                  <Input
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value ? parseInt(e.target.value) : 0 })
                    }
                    min={0}
                    required
                    className="h-12 md:h-14 bg-transparent border-foreground/10 text-base md:text-lg"
                  />
                </div>
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-2 md:mb-3 block">
                    Kilométer
                  </label>
                  <Input
                    type="number"
                    value={formData.mileage || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, mileage: e.target.value ? parseInt(e.target.value) : 0 })
                    }
                    min={0}
                    required
                    className="h-12 md:h-14 bg-transparent border-foreground/10 text-base md:text-lg"
                  />
                </div>
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-2 md:mb-3 block">
                    Teljesítmény (LE)
                  </label>
                  <Input
                    type="number"
                    value={formData.power || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, power: e.target.value ? parseInt(e.target.value) : 0 })
                    }
                    min={0}
                    required
                    className="h-12 md:h-14 bg-transparent border-foreground/10 text-base md:text-lg"
                  />
                </div>
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-2 md:mb-3 block">
                    Üzemanyag
                  </label>
                  <Select
                    value={formData.fuel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, fuel: value })
                    }
                  >
                    <SelectTrigger className="h-12 md:h-14 bg-transparent border-foreground/10 text-base md:text-lg">
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
                  <label className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-2 md:mb-3 block">
                    Váltó
                  </label>
                  <Select
                    value={formData.transmission}
                    onValueChange={(value) =>
                      setFormData({ ...formData, transmission: value })
                    }
                  >
                    <SelectTrigger className="h-12 md:h-14 bg-transparent border-foreground/10 text-base md:text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manuális">Manuális</SelectItem>
                      <SelectItem value="automata">Automata</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-2 md:mb-3 block">
                    Szín
                  </label>
                  <Input
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    placeholder="pl. Fekete"
                    required
                    className="h-12 md:h-14 bg-transparent border-foreground/10 text-base md:text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-2 md:mb-3 block">
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
                  className="bg-transparent border-foreground/10 text-base md:text-lg resize-none"
                />
              </div>

              <div>
                <label className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-2 md:mb-3 block">
                  Felszereltség (vesszővel elválasztva)
                </label>
                <Input
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  placeholder="pl. Bőr ülések, Navigáció, LED fényszórók"
                  className="h-12 md:h-14 bg-transparent border-foreground/10 text-base md:text-lg"
                />
              </div>

              <div>
                <label className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-2 md:mb-3 block">
                  Képek
                </label>

                {/* Feltöltött képek listája */}
                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3 mb-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group aspect-square">
                        <img
                          src={url}
                          alt={`Kép ${index + 1}`}
                          className="w-full h-full object-cover border border-foreground/10"
                        />
                        <button
                          type="button"
                          onClick={() => removeImageUrl(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                        <span className="absolute bottom-1 left-1 text-[10px] md:text-xs bg-black/70 text-white px-1 md:px-1.5 py-0.5">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Kép hozzáadás opciók */}
                <div className="flex flex-col gap-3 md:gap-4">
                  {/* URL hozzáadás */}
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <LinkIcon className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                      <Input
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addImageUrl();
                          }
                        }}
                        placeholder="Kép URL..."
                        className="h-12 md:h-14 bg-transparent border-foreground/10 text-base md:text-lg pl-10 md:pl-12"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addImageUrl}
                      disabled={!newImageUrl.trim()}
                      className="h-12 md:h-14 px-4 md:px-6 bg-foreground/10 hover:bg-foreground/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>

                  {/* Feltöltés progress jelző */}
                  {uploadProgress && (
                    <div className="text-center py-2 text-sm text-primary animate-pulse">
                      {uploadProgress}
                    </div>
                  )}

                  {/* Fájl feltöltés - Galéria */}
                  <label className={`relative flex items-center justify-center h-14 border border-dashed border-foreground/20 hover:border-foreground/40 active:border-primary active:bg-primary/5 transition-colors cursor-pointer touch-manipulation ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input
                      type="file"
                      accept="image/*,.heic,.heif"
                      multiple
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingImage}
                    />
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Upload className="w-5 h-5" />
                      <span className="text-sm uppercase tracking-widest">
                        {uploadingImage ? "Feltöltés folyamatban..." : "Képek kiválasztása"}
                      </span>
                    </div>
                  </label>

                  {/* Fájl feltöltés - Kamera (mobil) */}
                  <label className={`relative flex items-center justify-center h-14 border border-dashed border-foreground/20 hover:border-foreground/40 active:border-primary active:bg-primary/5 transition-colors cursor-pointer touch-manipulation md:hidden ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingImage}
                    />
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                        <circle cx="12" cy="13" r="3"/>
                      </svg>
                      <span className="text-sm uppercase tracking-widest">
                        {uploadingImage ? "Feltöltés..." : "Fénykép készítése"}
                      </span>
                    </div>
                  </label>
                </div>

                {imageUrls.length === 0 && (
                  <p className="text-xs md:text-sm text-muted-foreground mt-2">
                    Még nincs kép hozzáadva
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center h-12 md:h-14 px-6 md:px-10 bg-primary text-primary-foreground text-xs md:text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50"
                >
                  {saving ? "Mentés..." : editingCar ? "Mentés" : "Hozzáadás"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center h-12 md:h-14 px-6 md:px-10 border border-foreground/20 text-xs md:text-sm uppercase tracking-widest hover:bg-foreground/5 transition-colors duration-300"
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
          <div className="space-y-3 md:space-y-4 animate-fade-up delay-300">
            <div className="mb-4 md:mb-8">
              <p className="text-xs md:text-sm text-muted-foreground">
                {cars.filter(c => !c.sold && !c.fulfilled).length} elérhető autó
              </p>
            </div>
            <div className="grid gap-3 md:gap-4">
              {cars.filter(c => !c.sold && !c.fulfilled).map((car) => (
                <div
                  key={car.id}
                  className="border border-foreground/10 p-4 md:p-6 flex flex-col gap-3 md:gap-4"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-display-md mb-0.5 md:mb-1 font-display uppercase truncate">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {car.year} / {car.mileage.toLocaleString("hu-HU")} km /{" "}
                        {car.fuel} / {car.transmission}
                      </p>
                      <p className="text-primary text-base md:text-lg mt-1 md:mt-2 font-display">
                        {formatPrice(car.price)} Ft
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    <button
                      onClick={() => handleEdit(car)}
                      className="h-9 md:h-10 px-4 md:px-6 border border-foreground/20 text-xs md:text-sm uppercase tracking-widest hover:bg-foreground/5 transition-colors duration-300"
                    >
                      Szerkesztés
                    </button>
                    <button
                      onClick={() => toggleSold(car)}
                      className="h-9 md:h-10 px-4 md:px-6 border border-green-500/50 text-green-500 text-xs md:text-sm uppercase tracking-widest hover:bg-green-500/10 transition-colors duration-300"
                    >
                      Eladva
                    </button>
                    <button
                      onClick={() => toggleFulfilled(car)}
                      className="h-9 md:h-10 px-4 md:px-6 border border-blue-500/50 text-blue-500 text-xs md:text-sm uppercase tracking-widest hover:bg-blue-500/10 transition-colors duration-300"
                    >
                      Teljesítve
                    </button>
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="h-9 md:h-10 px-4 md:px-6 border border-red-500/50 text-red-500 text-xs md:text-sm uppercase tracking-widest hover:bg-red-500/10 transition-colors duration-300"
                    >
                      Törlés
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Eladott autók szekció */}
            {cars.filter(c => c.sold).length > 0 && (
              <>
                <div className="border-t border-foreground/10 pt-8 mt-8">
                  <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <Check className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg md:text-display-md font-display uppercase text-green-500">
                      Eladott autók
                    </h3>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      ({cars.filter(c => c.sold).length} db)
                    </span>
                  </div>
                </div>
                <div className="grid gap-3 md:gap-4">
                  {cars.filter(c => c.sold).map((car) => (
                    <div
                      key={car.id}
                      className="border border-green-500/30 bg-green-500/5 p-4 md:p-6 flex flex-col gap-3 md:gap-4 opacity-70"
                    >
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="mt-0.5 p-1.5 md:p-2">
                          <Check className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base md:text-display-md mb-0.5 md:mb-1 font-display uppercase truncate">
                            {car.brand} {car.model}
                          </h3>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {car.year} / {car.mileage.toLocaleString("hu-HU")} km /{" "}
                            {car.fuel} / {car.transmission}
                          </p>
                          <p className="text-green-500 text-base md:text-lg mt-1 md:mt-2 font-display line-through">
                            {formatPrice(car.price)} Ft
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 md:gap-3 ml-10 md:ml-14">
                        <button
                          onClick={() => toggleSold(car)}
                          className="h-9 md:h-10 px-4 md:px-6 border border-green-500/50 text-green-500 text-xs md:text-sm uppercase tracking-widest hover:bg-green-500/10 transition-colors duration-300"
                        >
                          Visszaállítás
                        </button>
                        <button
                          onClick={() => handleDelete(car.id)}
                          className="h-9 md:h-10 px-4 md:px-6 border border-red-500/50 text-red-500 text-xs md:text-sm uppercase tracking-widest hover:bg-red-500/10 transition-colors duration-300"
                        >
                          Törlés
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Teljesített megrendelések szekció */}
            {cars.filter(c => c.fulfilled).length > 0 && (
              <>
                <div className="border-t border-foreground/10 pt-8 mt-8">
                  <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <PackageCheck className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg md:text-display-md font-display uppercase text-blue-500">
                      Teljesített megrendelések
                    </h3>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      ({cars.filter(c => c.fulfilled).length} db)
                    </span>
                  </div>
                </div>
                <div className="grid gap-3 md:gap-4">
                  {cars.filter(c => c.fulfilled).map((car) => (
                    <div
                      key={car.id}
                      className="border border-blue-500/30 bg-blue-500/5 p-4 md:p-6 flex flex-col gap-3 md:gap-4 opacity-60"
                    >
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="mt-0.5 p-1.5 md:p-2">
                          <PackageCheck className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base md:text-display-md mb-0.5 md:mb-1 font-display uppercase truncate">
                            {car.brand} {car.model}
                          </h3>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {car.year} / {car.mileage.toLocaleString("hu-HU")} km /{" "}
                            {car.fuel} / {car.transmission}
                          </p>
                          <p className="text-blue-500 text-base md:text-lg mt-1 md:mt-2 font-display line-through">
                            {formatPrice(car.price)} Ft
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 md:gap-3 ml-10 md:ml-14">
                        <button
                          onClick={() => toggleFulfilled(car)}
                          className="h-9 md:h-10 px-4 md:px-6 border border-blue-500/50 text-blue-500 text-xs md:text-sm uppercase tracking-widest hover:bg-blue-500/10 transition-colors duration-300"
                        >
                          Visszaállítás
                        </button>
                        <button
                          onClick={() => handleDelete(car.id)}
                          className="h-9 md:h-10 px-4 md:px-6 border border-red-500/50 text-red-500 text-xs md:text-sm uppercase tracking-widest hover:bg-red-500/10 transition-colors duration-300"
                        >
                          Törlés
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
