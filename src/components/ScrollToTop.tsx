import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component that automatically scrolls to the top of the page
 * whenever the route changes. This component should be placed inside BrowserRouter.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
