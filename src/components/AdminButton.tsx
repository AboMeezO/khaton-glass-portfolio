import { useState } from "react";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminButton = () => {
  const [clickCount, setClickCount] = useState(0);
  const [resetTimer, setResetTimer] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const handleClick = () => {
    // Reset timer if exists
    if (resetTimer) {
      clearTimeout(resetTimer);
    }

    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Reset count after 3 seconds of inactivity
    const timer = setTimeout(() => {
      setClickCount(0);
    }, 3000);
    setResetTimer(timer);

    // If clicked 5 times, navigate to admin
    if (newCount >= 5) {
      setClickCount(0);
      navigate('/admin');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 left-6 w-10 h-10 opacity-5 hover:opacity-100 transition-all duration-500 rounded-full glass flex items-center justify-center group"
      aria-label="Admin access"
    >
      <Settings className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:rotate-180 transition-all duration-700" />
    </button>
  );
};

export default AdminButton;
