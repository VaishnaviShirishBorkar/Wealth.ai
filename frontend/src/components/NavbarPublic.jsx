import { LogOut, User, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function NavbarPublic() {

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
    alert("logged out");
  }

  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center absolute top-0 left-0 z-10 bg-gradient-to-r from-indigo-900 via-blue-800 to-sky-700">
      
      {/* LOGO */}
      <Link className="cursor-pointer" to={"/"}>
      <h1 className="text-xl font-bold text-white">
        Wealth<span className="text-sky-400">AI</span>
      </h1> 
      </Link>

      {!token? (
        <Link 
          to="/login"
        >
          <UserCircle
          size={32}
           className="text-white hover:text-sky-300 cursor-pointer"
          />
        </Link>
      ): (
        <div className="flex gap-3 text-white items-center">
          <Link className="text-sm hover:text-sky-200" to="/dashboard">
          Dashboard
          </Link>

          <button onClick={logout}>
          <LogOut
            size={30}
            className="text-white hover:text-red-300"
          />
          </button>
        </div>
      )}

    </nav>
  );
}
