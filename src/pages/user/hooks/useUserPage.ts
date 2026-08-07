import { useEffect, useState } from 'react';
import { 
  getUserIPC, 
  getDeviceInfoIPC, 
  updateDisplayNameIPC, 
  updateAvatarIPC,
  selectAvatarFileIPC,
  uploadAvatarFromPathIPC,
  convertFileSrcIPC
} from '../../../personalities/ambiverts/user';
import type { User, DeviceInfo } from '../../../personalities/ambiverts/user';
export type { User, DeviceInfo };

import toast from 'react-hot-toast';

export const useUserPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form fields
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  // Preference mockup states
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [accent, setAccent] = useState('#6366f1');

  const loadData = async () => {
    try {
      const userData = await getUserIPC();
      const deviceData = await getDeviceInfoIPC();
      setUser(userData);
      setDeviceInfo(deviceData);
      
      // Initialize edit fields
      setEditName(userData.display_name);
      setEditAvatar(userData.avatar || "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)");
    } catch (err) {
      console.error("Failed to load user or device info", err);
      toast.error("Failed to load user profile");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyId = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    toast.success("User ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }
    try {
      await updateDisplayNameIPC(editName.trim());
      await updateAvatarIPC(editAvatar);
      toast.success("Profile saved successfully");
      setIsEditModalOpen(false);
      
      // Refresh current page info
      await loadData();
      
      // Dispatch event to sync the sidebar account widget
      window.dispatchEvent(new CustomEvent('user-updated'));
    } catch (err) {
      console.error("Failed to save profile changes", err);
      toast.error("Failed to update profile");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const handleUploadCustomAvatar = async () => {
    try {
      const filePath = await selectAvatarFileIPC();
      if (!filePath) return;

      toast.loading("Verifying and copying custom image...", { id: "avatar-upload" });
      const updatedUser = await uploadAvatarFromPathIPC(filePath);
      
      setUser(updatedUser);
      setEditAvatar(updatedUser.avatar || '');
      toast.success("Custom avatar updated successfully", { id: "avatar-upload" });
      
      window.dispatchEvent(new CustomEvent('user-updated'));
    } catch (err) {
      console.error("Failed to upload custom avatar", err);
      toast.error("Failed to upload custom image", { id: "avatar-upload" });
    }
  };

  return {
    user,
    deviceInfo,
    isEditModalOpen,
    setIsEditModalOpen,
    copied,
    handleCopyId,
    editName,
    setEditName,
    editAvatar,
    setEditAvatar,
    theme,
    setTheme,
    accent,
    setAccent,
    handleSaveProfile,
    getInitials,
    handleUploadCustomAvatar,
    convertFileSrc: convertFileSrcIPC
  };

};

export type UserPageHook = ReturnType<typeof useUserPage>;
