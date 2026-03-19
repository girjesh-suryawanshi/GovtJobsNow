import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserProfile } from "@/hooks/use-user-profile";
import { User, Calendar, GraduationCap, Users } from "lucide-react";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  onSave,
  initialProfile,
}: UserProfileModalProps) {
  const [formData, setFormData] = useState<UserProfile>(
    initialProfile || {
      dob: "",
      qualification: "Graduate",
      category: "General",
      gender: "Male",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <User className="h-5 w-5" />
            Set Up Your Profile
          </DialogTitle>
          <DialogDescription>
            Input your details to instantly see if you're eligible for any job. 
            Your data is stored locally on your device.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dob" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              Date of Birth
            </Label>
            <Input
              id="dob"
              type="date"
              required
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualification" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-gray-500" />
              Highest Qualification
            </Label>
            <Select
              value={formData.qualification}
              onValueChange={(value) =>
                setFormData({ ...formData, qualification: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Qualification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10th Pass">10th Pass (High School)</SelectItem>
                <SelectItem value="12th Pass">12th Pass (Intermediate)</SelectItem>
                <SelectItem value="Diploma">Diploma</SelectItem>
                <SelectItem value="Graduate">Graduate (Any Stream)</SelectItem>
                <SelectItem value="B.E./B.Tech">B.E. / B.Tech</SelectItem>
                <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                <SelectItem value="PhD">Doctorate (PhD)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General/UR</SelectItem>
                  <SelectItem value="OBC">OBC</SelectItem>
                  <SelectItem value="SC">SC</SelectItem>
                  <SelectItem value="ST">ST</SelectItem>
                  <SelectItem value="EWS">EWS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, gender: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Save Profile & Match Jobs
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
