// filepath: c:\Users\lenovo\Desktop\AI BACKEND FREELANCING\Crack-Off-Campus\src\hooks\use-media-query.ts
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const documentChangeHandler = () => setMatches(mediaQueryList.matches);

    // Set the initial state
    documentChangeHandler();

    // Listen for changes
    mediaQueryList.addEventListener("change", documentChangeHandler);

    // Clean up the listener on component unmount
    return () => {
      mediaQueryList.removeEventListener("change", documentChangeHandler);
    };
  }, [query]); // Re-run effect if query changes

  return matches;
}
