
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { User, Building, Clock } from "lucide-react";

const Header = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  return (
    <header className="bg-blue-500 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white">
          Feedback Hub
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center text-sm text-white">
                <span className="mr-1">Welcome, {user?.username}</span>
                {user?.company && (
                  <div className="flex items-center ml-2">
                    <Building className="h-3 w-3 mr-1" />
                    <span>{user.company}</span>
                  </div>
                )}
              </div>
              {isAdmin ? (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="bg-white text-blue-500 hover:bg-blue-50">
                    Admin Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="bg-white text-blue-500 hover:bg-blue-50">
                    My Dashboard
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-blue-600">
                Logout
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="outline" className="bg-white text-blue-500 hover:bg-blue-50">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-white text-blue-500 hover:bg-blue-50">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
