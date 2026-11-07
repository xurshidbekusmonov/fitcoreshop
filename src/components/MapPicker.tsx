// MapPicker component using Leaflet and OpenStreetMap
// This modal allows the user to pick a location on the map and returns a human‑readable address.
// Props:
//   initialAddress?: string – optional initial address (not used for geocoding in this simple version).
//   onSelect: (address: string) => void – called with the resolved address when user confirms.
//   onClose: () => void – called when the modal is dismissed without selection.

"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon paths for Leaflet (required when bundling with Vite/Next)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapPickerProps {
  initialAddress?: string;
  onSelect: (address: string) => void;
  onClose: () => void;
}

const DEFAULT_POSITION: [number, number] = [41.311158, 69.279737]; // Tashkent centre

function ClickHandler({ setPosition }: { setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function MapPicker({ initialAddress, onSelect, onClose }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number]>(DEFAULT_POSITION);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Reverse‑geocode when position changes
  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position[0]}&lon=${position[1]}`
        );
        if (!res.ok) throw new Error("Geocoding request failed");
        const data = await res.json();
        setAddress(data.display_name ?? "");
      } catch (e: any) {
        setError(e.message || "Geocoding error");
      } finally {
        setLoading(false);
      }
    };
    fetchAddress();
  }, [position]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-950 text-white w-full max-w-2xl rounded-2xl p-4 shadow-xl relative border border-zinc-800">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-400 hover:text-white"
        >
          ✕
        </button>
        <h3 className="text-lg font-bold mb-2">{"Tanlang joyni (Click on map)"}</h3>
        <div className="h-96 mb-4">
          <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} />
            <ClickHandler setPosition={setPosition} />
          </MapContainer>
        </div>
        {loading && <p className="text-sm text-yellow-300">{"Manzilni aniqlash…"}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {address && (
          <p className="text-sm mb-2 border-b pb-2 border-zinc-700">
            {"Tanlangan manzil:"} <span className="font-mono">{address}</span>
          </p>
        )}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded"
          >
            {"Bekor qilish"}
          </button>
          <button
            onClick={() => {
              onSelect(address);
              onClose();
            }}
            disabled={!address}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C59B27] text-black font-bold rounded disabled:opacity-50"
          >
            {"Tasdiqlash"}
          </button>
        </div>
      </div>
    </div>
  );
}
