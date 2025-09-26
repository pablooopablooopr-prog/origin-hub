import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Packs = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to main page since packs section is now on homepage
    navigate('/');
  }, [navigate]);

  return null;
};

export default Packs;