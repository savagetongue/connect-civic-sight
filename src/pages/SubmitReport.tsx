import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { LocationPicker } from "@/components/LocationPicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function SubmitReport() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [zoneId, setZoneId] = useState<string>("");
  const [priority, setPriority] = useState<string>("medium");
  const [isPublic, setIsPublic] = useState(true);
  const [locationText, setLocationText] = useState("");
  const [locationLat, setLocationLat] = useState("");
  const [locationLon, setLocationLon] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: zones } = useQuery({
    queryKey: ["zones"],
    queryFn: async () => {
      const { data, error } = await supabase.from("zones").select("*");
      if (error) throw error;
      return data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const { data: incident, error: incidentError } = await supabase
        .from("incidents")
        .insert([{
          title,
          description,
          category_id: categoryId ? parseInt(categoryId) : null,
          zone_id: zoneId ? parseInt(zoneId) : null,
          priority: priority as any,
          is_public: isPublic,
          location_text: locationText || null,
          location_lat: locationLat ? parseFloat(locationLat) : null,
          location_lon: locationLon ? parseFloat(locationLon) : null,
        }])
        .select()
        .single();

      if (incidentError) throw incidentError;

      if (photos.length > 0) {
        for (const photo of photos) {
          const fileExt = photo.name.split(".").pop();
          const fileName = `${incident.id}/${crypto.randomUUID()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from("incident-photos")
            .upload(fileName, photo);

          if (uploadError) throw uploadError;

          const { error: photoError } = await supabase
            .from("incident_photos")
            .insert({
              incident_id: incident.id,
              uploaded_by: user.id,
              file_name: photo.name,
              bucket_path: fileName,
              file_size: photo.size,
            });

          if (photoError) throw photoError;
        }
      }

      return incident;
    },
    onSuccess: () => {
      toast({
        title: "Report submitted",
        description: "Your incident report has been submitted successfully.",
      });
      navigate("/my-reports");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit report",
        variant: "destructive",
      });
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(f => f.size <= 5 * 1024 * 1024);
      if (validFiles.length < files.length) {
        toast({
          title: "Warning",
          description: "Some files were too large (max 5MB)",
          variant: "destructive",
        });
      }
      setPhotos(prev => [...prev, ...validFiles].slice(0, 5));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container max-w-3xl pt-24 pb-16 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Report an Incident</CardTitle>
            <CardDescription>
              Provide details about the incident you want to report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Brief description of the issue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  placeholder="Provide detailed information about the incident"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zone">Zone</Label>
                  <Select value={zoneId} onValueChange={setZoneId}>
                    <SelectTrigger id="zone">
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {zones?.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id.toString()}>
                          {zone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Location *</Label>
                <LocationPicker
                  onLocationSelect={(location) => {
                    setLocationText(location.address);
                    setLocationLat(location.lat.toString());
                    setLocationLon(location.lng.toString());
                  }}
                  defaultLocation={
                    locationText && locationLat && locationLon
                      ? {
                          address: locationText,
                          lat: parseFloat(locationLat),
                          lng: parseFloat(locationLon),
                        }
                      : undefined
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Photos (max 5, 5MB each)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                    disabled={photos.length >= 5}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("photo-upload")?.click()}
                    disabled={photos.length >= 5}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photos
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {photos.length}/5 photos
                  </span>
                </div>
                {photos.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {photos.map((photo, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Upload ${idx + 1}`}
                          className="h-20 w-20 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => removePhoto(idx)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="public">Make this report public</Label>
                  <p className="text-sm text-muted-foreground">
                    Public reports can be viewed by everyone
                  </p>
                </div>
                <Switch
                  id="public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Report
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
