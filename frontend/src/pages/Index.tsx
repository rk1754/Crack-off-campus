// in your main file like index.js or App.js or inside this component
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the Home page, since we've built a custom home page
    navigate("/");
  }, [navigate]);

  return null; // This won't render as we're redirecting
};

export default Index;
