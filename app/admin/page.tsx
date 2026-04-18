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
import { Plus, X, Upload, Link as LinkIcon, Check, PackageCheck, Download, Search } from "lucide-react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

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

// Roboto font betöltése és cache-elése
let robotoFontLoaded = false;
let robotoFontBase64: string | null = null;

async function loadRobotoFont(): Promise<string> {
  if (robotoFontBase64) return robotoFontBase64;

  // Roboto Regular font CDN-ről
  const fontUrl = 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf';

  try {
    const response = await fetch(fontUrl);
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    robotoFontBase64 = btoa(binary);
    return robotoFontBase64;
  } catch (error) {
    console.error('Failed to load Roboto font:', error);
    throw error;
  }
}

// Logo betöltése és PNG-re konvertálása az eredeti arányokkal
interface LogoResult {
  dataUrl: string;
  aspectRatio: number; // width / height
}

async function loadLogoWithDimensions(): Promise<LogoResult | null> {
  try {
    // SVG logo betöltése (cache-busting)
    const response = await fetch('/logo-osicar.svg?v=' + Date.now());
    if (!response.ok) return null;

    const svgText = await response.text();

    return new Promise((resolve) => {
      const img = new window.Image();
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        // A canvas mérete a kép arányaihoz igazodik
        const scale = 4; // Nagy felbontás a jó minőségért
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Átlátszó háttér
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/png');
          const aspectRatio = img.width / img.height;
          resolve({ dataUrl, aspectRatio });
        } else {
          resolve(null);
        }
        URL.revokeObjectURL(url);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };

      img.src = url;
    });
  } catch (error) {
    console.error('Failed to load logo:', error);
    return null;
  }
}

// Saját szövegtördelő függvény
function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = doc.getTextWidth(testLine);

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

// Ártábla PDF generálás
async function generatePriceTable(car: CarData): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Roboto font betöltése és hozzáadása
  try {
    const fontBase64 = await loadRobotoFont();
    doc.addFileToVFS('Roboto-Regular.ttf', fontBase64);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    robotoFontLoaded = true;
  } catch {
    console.warn('Could not load Roboto font, falling back to helvetica');
  }

  const useRoboto = robotoFontLoaded;
  const fontFamily = useRoboto ? 'Roboto' : 'helvetica';

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  const spacing = 6; // Egységes térköz
  let y = margin;

  // QR kód méretek
  const qrSize = 40;
  const qrBottomMargin = margin + qrSize + spacing;

  // QR kód generálás
  const carUrl = `https://osicar.hu/autok/db/${car.id}`;
  let qrDataUrl: string | null = null;
  try {
    qrDataUrl = await QRCode.toDataURL(carUrl, { width: 300, margin: 1 });
  } catch (err) {
    console.error("QR code generation failed:", err);
  }

  // === FEJLÉC ===
  // Logo középen
  try {
    const logoResult = await loadLogoWithDimensions();
    if (logoResult) {
      const { dataUrl, aspectRatio } = logoResult;
      const logoWidth = 65;
      const logoHeight = logoWidth / aspectRatio;
      const logoX = (pageWidth - logoWidth) / 2;
      doc.addImage(dataUrl, "PNG", logoX, y, logoWidth, logoHeight);
      y += logoHeight + spacing;
    }
  } catch (err) {
    console.error("Logo loading failed:", err);
    doc.setFontSize(18);
    doc.setFont(fontFamily, 'normal');
    doc.text("OSICAR", pageWidth / 2, y + 10, { align: "center" });
    y += 15;
  }

  // Elérhetőségek
  doc.setFontSize(9);
  doc.setFont(fontFamily, 'normal');
  doc.text("9500 Celldömölk, Magyarország  |  +36 70 605 0350  |  info@osicar.hu", pageWidth / 2, y, { align: "center" });
  y += spacing * 2;

  // Elválasztó vonal
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += spacing * 2;

  // === AUTÓ ADATOK ===
  // Autó neve
  doc.setFontSize(22);
  doc.setFont(fontFamily, 'normal');
  const carTitle = `${car.brand} ${car.model}`.toUpperCase();
  doc.text(carTitle, margin, y);
  y += spacing * 2;

  // Műszaki adatok táblázat
  const tableData = [
    ["Gyártási év:", car.year.toString()],
    ["Kilométeróra:", `${car.mileage.toLocaleString("hu-HU")} km`],
    ["Teljesítmény:", `${car.power} LE`],
    ["Üzemanyag:", car.fuel.charAt(0).toUpperCase() + car.fuel.slice(1)],
    ["Váltó:", car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1)],
    ["Szín:", car.color],
  ];

  const colWidth = contentWidth / 2;
  const rowHeight = 8;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.4);
  doc.rect(margin, y, contentWidth, tableData.length * rowHeight + 4, "S");

  doc.setFontSize(10);
  tableData.forEach((row, index) => {
    const rowY = y + 5 + index * rowHeight;
    doc.setFont(fontFamily, 'normal');
    doc.text(row[0], margin + 5, rowY);
    doc.text(row[1], margin + colWidth, rowY);
  });

  y += tableData.length * rowHeight + 4 + spacing * 2;

  // Vételár
  doc.setFontSize(14);
  doc.setFont(fontFamily, 'normal');
  doc.text("Vételár:", margin, y);
  doc.setFontSize(22);
  doc.text(`${formatPrice(car.price)} Ft`, margin + 26, y);
  y += spacing * 2;

  // Elválasztó vonal
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += spacing * 2;

  // === LEÍRÁS ===
  if (car.description) {
    doc.setFontSize(13);
    doc.setFont(fontFamily, 'normal');
    doc.text("Leírás:", margin, y);
    y += spacing + 2;

    doc.setFontSize(11);
    const descLines = wrapText(doc, car.description, contentWidth);
    const lineHeight = 5.5;
    let currentPage = 1;

    for (const line of descLines) {
      const bottomLimit = currentPage === 1 ? pageHeight - qrBottomMargin : pageHeight - margin;
      if (y > bottomLimit) {
        doc.addPage();
        currentPage++;
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    }
    y += spacing;
  }

  // === FELSZERELTSÉG ===
  if (car.features && car.features.length > 0) {
    const currentPage = doc.getNumberOfPages();
    const bottomLimit = currentPage === 1 ? pageHeight - qrBottomMargin : pageHeight - margin;

    if (y > bottomLimit - 15) {
      doc.addPage();
      y = margin;
    }

    doc.setFontSize(13);
    doc.setFont(fontFamily, 'normal');
    doc.text("Felszereltség:", margin, y);
    y += spacing + 2;

    doc.setFontSize(9);
    const featuresText = car.features.join("  •  ");
    const featureLines = wrapText(doc, featuresText, contentWidth);
    const lineHeight = 4.5;

    for (const line of featureLines) {
      const currentPageNow = doc.getNumberOfPages();
      const bottomLimitNow = currentPageNow === 1 ? pageHeight - qrBottomMargin : pageHeight - margin;
      if (y > bottomLimitNow) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    }
  }

  // === QR KÓD ===
  doc.setPage(1);
  if (qrDataUrl) {
    const qrX = (pageWidth - qrSize) / 2;
    const qrY = pageHeight - margin - qrSize; // Alul
    doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

    // osicar.hu felirat a QR kód alatt
    doc.setFontSize(9);
    doc.setFont(fontFamily, 'normal');
    doc.text("osicar.hu", pageWidth / 2, pageHeight - margin + 5, { align: "center" });
  }

  // PDF mentése
  const fileName = `artabla_${car.brand}_${car.model}_${car.year}.pdf`
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_.-]/g, "");

  // Mobilon a Web Share API-t használjuk, hogy le lehessen tölteni/megosztani
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile && navigator.share && navigator.canShare) {
    // PDF blob létrehozása
    const pdfBlob = doc.output('blob');
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

    // Ellenőrizzük, hogy megosztható-e
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `${car.brand} ${car.model} ártábla`,
        });
        return;
      } catch (err) {
        // Ha a felhasználó bezárja a share dialogot, ne csináljunk semmit
        if ((err as Error).name === 'AbortError') return;
        console.log('Share failed, falling back to download');
      }
    }
  }

  // Desktop vagy ha a share nem működik
  doc.save(fileName);
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
  const [searchQuery, setSearchQuery] = useState("");

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

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem("adminAuth", "true");
        setPasswordError(false);
      } else {
        setPasswordError(true);
      }
    } catch {
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

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8 animate-fade-up delay-200">
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

        {/* Keresés */}
        <div className="mb-8 md:mb-12 animate-fade-up delay-200">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Keresés márka vagy modell alapján..."
              className="h-12 md:h-14 bg-transparent border-foreground/10 text-base md:text-lg pl-12"
            />
          </div>
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
                {cars.filter(c => !c.sold && !c.fulfilled && (
                  searchQuery === "" ||
                  `${c.brand} ${c.model}`.toLowerCase().includes(searchQuery.toLowerCase())
                )).length} elérhető autó
                {searchQuery && ` (szűrve: "${searchQuery}")`}
              </p>
            </div>
            <div className="grid gap-3 md:gap-4">
              {cars.filter(c => !c.sold && !c.fulfilled && (
                searchQuery === "" ||
                `${c.brand} ${c.model}`.toLowerCase().includes(searchQuery.toLowerCase())
              )).map((car) => (
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
                      onClick={() => generatePriceTable(car)}
                      className="h-9 md:h-10 px-4 md:px-6 border border-orange-500/50 text-orange-500 text-xs md:text-sm uppercase tracking-widest hover:bg-orange-500/10 transition-colors duration-300 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Ártábla
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
            {cars.filter(c => c.sold && (
              searchQuery === "" ||
              `${c.brand} ${c.model}`.toLowerCase().includes(searchQuery.toLowerCase())
            )).length > 0 && (
              <>
                <div className="border-t border-foreground/10 pt-8 mt-8">
                  <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <Check className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg md:text-display-md font-display uppercase text-green-500">
                      Eladott autók
                    </h3>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      ({cars.filter(c => c.sold && (
                        searchQuery === "" ||
                        `${c.brand} ${c.model}`.toLowerCase().includes(searchQuery.toLowerCase())
                      )).length} db)
                    </span>
                  </div>
                </div>
                <div className="grid gap-3 md:gap-4">
                  {cars.filter(c => c.sold && (
                    searchQuery === "" ||
                    `${c.brand} ${c.model}`.toLowerCase().includes(searchQuery.toLowerCase())
                  )).map((car) => (
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
                          onClick={() => generatePriceTable(car)}
                          className="h-9 md:h-10 px-4 md:px-6 border border-orange-500/50 text-orange-500 text-xs md:text-sm uppercase tracking-widest hover:bg-orange-500/10 transition-colors duration-300 flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Ártábla
                        </button>
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
            {cars.filter(c => c.fulfilled && (
              searchQuery === "" ||
              `${c.brand} ${c.model}`.toLowerCase().includes(searchQuery.toLowerCase())
            )).length > 0 && (
              <>
                <div className="border-t border-foreground/10 pt-8 mt-8">
                  <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <PackageCheck className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg md:text-display-md font-display uppercase text-blue-500">
                      Teljesített megrendelések
                    </h3>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      ({cars.filter(c => c.fulfilled && (
                        searchQuery === "" ||
                        `${c.brand} ${c.model}`.toLowerCase().includes(searchQuery.toLowerCase())
                      )).length} db)
                    </span>
                  </div>
                </div>
                <div className="grid gap-3 md:gap-4">
                  {cars.filter(c => c.fulfilled && (
                    searchQuery === "" ||
                    `${c.brand} ${c.model}`.toLowerCase().includes(searchQuery.toLowerCase())
                  )).map((car) => (
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
                          onClick={() => generatePriceTable(car)}
                          className="h-9 md:h-10 px-4 md:px-6 border border-orange-500/50 text-orange-500 text-xs md:text-sm uppercase tracking-widest hover:bg-orange-500/10 transition-colors duration-300 flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Ártábla
                        </button>
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
