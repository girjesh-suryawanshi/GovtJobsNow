import { useState } from "react";
import { Plus, X, Bell, Target, Calendar, Bookmark, Share2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingActionMenuProps {
  onOpenJobAlerts: () => void;
  onOpenJobTracker: () => void;
  onOpenExamCalendar: () => void;
}

export default function FloatingActionMenu({ 
  onOpenJobAlerts, 
  onOpenJobTracker, 
  onOpenExamCalendar 
}: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    {
      icon: Bell,
      label: "Job Alerts",
      onClick: () => {
        onOpenJobAlerts();
        setIsOpen(false);
      },
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: Target,
      label: "Track Applications", 
      onClick: () => {
        onOpenJobTracker();
        setIsOpen(false);
      },
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: Calendar,
      label: "Exam Calendar",
      onClick: () => {
        onOpenExamCalendar();
        setIsOpen(false);
      },
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      icon: Bookmark,
      label: "Saved Jobs",
      onClick: () => {
        // TODO: Implement saved jobs functionality
        setIsOpen(false);
      },
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2"
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="bg-white text-gray-800 px-3 py-1 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
                <Button
                  size="icon"
                  className={`w-12 h-12 rounded-full shadow-lg ${item.color} text-white`}
                  onClick={item.onClick}
                >
                  <item.icon className="h-5 w-5" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <Button
        size="icon"
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 rotate-45' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
        onClick={toggleMenu}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
        </motion.div>
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}