import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/admin/notifications");
      setNotifications(res.data.notifications || []);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  const markAsRead = async (id: string) => {
    await axios.put(`/api/v1/admin/notifications/${id}/read`);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <Button variant="ghost" onClick={() => setOpen((v) => !v)}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">{unreadCount}</span>
        )}
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 font-semibold border-b">Notifications</div>
          {loading ? (
            <div className="p-3 text-center">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-3 text-center text-gray-500">No notifications</div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={`p-3 border-b last:border-b-0 flex items-start gap-2 ${n.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                <div className="flex-1">
                  <div className="text-sm font-medium">{n.message}</div>
                  <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                {!n.read && (
                  <Button size="sm" variant="outline" onClick={() => markAsRead(n.id)}>
                    Mark as read
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
