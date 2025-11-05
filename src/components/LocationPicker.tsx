import { useState, useCallback } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";

// Public Google Maps API key for map display (read-only, safe for client-side)
const GOOGLE_MAPS_API_KEY = "AIzaSyDLTj4M_XwQ9yqC8vJZqVZ7Z_qZ4_8Z8Z8";

interface LocationPickerProps {
  onLocationSelect: (location: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
  defaultLocation?: {
    address: string;
    lat: number;
    lng: number;
  };
}

export function LocationPicker({ onLocationSelect, defaultLocation }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState(defaultLocation?.address || "");
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(
    defaultLocation ? { lat: defaultLocation.lat, lng: defaultLocation.lng } : null
  );
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default: New York

  const handleMapClick = useCallback((event: any) => {
    if (event.detail?.latLng) {
      const lat = event.detail.latLng.lat;
      const lng = event.detail.latLng.lng;
      setSelectedPosition({ lat, lng });
      
      // Reverse geocode to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const address = results[0].formatted_address;
          setSearchQuery(address);
          onLocationSelect({ address, lat, lng });
        }
      });
    }
  }, [onLocationSelect]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        const address = results[0].formatted_address;
        
        setSelectedPosition({ lat, lng });
        setMapCenter({ lat, lng });
        setSearchQuery(address);
        onLocationSelect({ address, lat, lng });
      }
    });
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setSelectedPosition({ lat, lng });
          setMapCenter({ lat, lng });
          
          // Reverse geocode to get address
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const address = results[0].formatted_address;
              setSearchQuery(address);
              onLocationSelect({ address, lat, lng });
            }
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label>Search Location</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter address or place name..."
                className="pl-10"
              />
            </div>
            <Button type="button" onClick={handleSearch} variant="secondary">
              Search
            </Button>
            <Button type="button" onClick={handleCurrentLocation} variant="outline" size="icon">
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="h-[400px] rounded-lg overflow-hidden border">
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <Map
              center={mapCenter}
              zoom={13}
              mapId="incident-map"
              onClick={handleMapClick}
              gestureHandling="greedy"
            >
              {selectedPosition && (
                <AdvancedMarker position={selectedPosition}>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <MapPin className="h-4 w-4 text-primary-foreground" />
                  </div>
                </AdvancedMarker>
              )}
            </Map>
          </APIProvider>
        </div>

        {selectedPosition && (
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">Selected Location:</p>
            <p>{searchQuery || `${selectedPosition.lat.toFixed(6)}, ${selectedPosition.lng.toFixed(6)}`}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
