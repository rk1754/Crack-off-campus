
import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    
    const handleMobileChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mobileQuery.matches);
    
    mobileQuery.addEventListener("change", handleMobileChange);
    
    return () => {
      mobileQuery.removeEventListener("change", handleMobileChange);
    };
  }, []);

  return isMobile;
}
