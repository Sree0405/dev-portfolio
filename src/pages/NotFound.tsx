import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="app-canvas flex min-h-screen flex-col items-center justify-center px-6">
      <div className="glass-panel max-w-md rounded-2xl p-10 text-center">
        <p className="section-eyebrow mb-3">Error</p>
        <h1 className="mb-2 text-5xl font-bold tracking-tight">404</h1>
        <p className="mb-6 text-muted-foreground">
          This page doesn’t exist or was moved.
        </p>
        <Link
          to="/"
          className="btn-gradient inline-flex rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Return home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
