import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/YuvaNext.svg";

const Navbar = () => {
  const { user, admin, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/signin");
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 shadow-sm">
        <div className="w-full mx-auto h-16 px-4 sm:px-6 lg:px-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/dashboard">
              <img
                src={logo}
                className="h-12 w-auto cursor-pointer"
                alt="YuvaNext Logo"
              />
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* User Avatar with Dropdown - Desktop */}
            <div className="hidden lg:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-between bg-[#F0F5FF] rounded-full pl-2 sm:pl-3 pr-1 gap-2 py-1.5 shadow-sm hover:bg-[#E5EEFF] transition-colors">
                    <div className="flex flex-col justify-center space-y-[3px] m-1.5">
                      <div className="h-[3px] w-3 bg-gray-500 rounded-full self-start"></div>
                      <div className="h-[3px] w-[26px] bg-gray-500 rounded-full mx-auto"></div>
                      <div className="h-[3px] w-3 bg-gray-500 rounded-full self-end"></div>
                    </div>

                    <Avatar className="h-10 w-10 border border-white shadow-md">
                      <AvatarImage
                        src={undefined}
                        alt={admin?.name || user?.email || "Admin"}
                      />
                      <AvatarFallback className="text-sm bg-[#F8F6F2] text-gray-800 font-semibold">
                        {admin?.name?.charAt(0).toUpperCase() ||
                          user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-lg">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {admin?.name || user?.email || "Admin"}
                    </p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 mt-1"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-between bg-[#F0F5FF] rounded-full pl-2 pr-1 gap-2 py-1.5 shadow-sm"
            >
              <div className="flex flex-col justify-center space-y-[3px] m-1.5">
                <div className="h-[3px] w-3 bg-gray-500 rounded-full self-start"></div>
                <div className="h-[3px] w-[26px] bg-gray-500 rounded-full mx-auto"></div>
                <div className="h-[3px] w-3 bg-gray-500 rounded-full self-end"></div>
              </div>

              <Avatar className="h-10 w-10 border border-white shadow-md">
                <AvatarImage
                  src={undefined}
                  alt={admin?.name || user?.email || "Admin"}
                />
                <AvatarFallback className="text-sm bg-[#F8F6F2] text-gray-800 font-semibold">
                  {admin?.name?.charAt(0).toUpperCase() ||
                    user?.email?.charAt(0).toUpperCase() ||
                    "A"}
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-16 bottom-0 w-72 bg-white shadow-xl overflow-y-auto">
            <div className="flex flex-col h-full">
              {/* User Section */}
              <div className="p-6 border-b">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 border-2 border-gray-200">
                    <AvatarImage
                      src={undefined}
                      alt={admin?.name || user?.email || "Admin"}
                    />
                    <AvatarFallback className="text-sm bg-[#F8F6F2] text-gray-800 font-semibold">
                      {admin?.name?.charAt(0).toUpperCase() ||
                        user?.email?.charAt(0).toUpperCase() ||
                        "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {admin?.name || user?.email || "Admin"}
                    </p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
              </div>

              {/* Sign Out Button */}
              <div className="flex-1 py-2">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-6 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
