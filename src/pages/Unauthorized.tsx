import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";

import signupIllustrate from "@/assets/signinillustion.png";
import signinLogo from "@/assets/signinLogo.svg";

export default function Unauthorized() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  useEffect(() => {
    if (user) signOut();
  }, [user, signOut]);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Illustration */}
      <div className="hidden lg:flex w-[41%] h-screen relative p-4">
        <div className="w-full h-full rounded-3xl overflow-hidden relative">
          <img
            src={signupIllustrate}
            alt="Unauthorized Illustration"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 px-8">
            <img src={signinLogo} alt="Logo" className="w-28 h-auto" />
            <p className="text-white text-base font-medium max-w-xl leading-relaxed">
              Access to this area is restricted. Only verified admins may enter.
            </p>
          </div>

          <div className="absolute bottom-4 left-0 right-0 px-6 text-white/80 text-xs">
            <a
              href="https://www.yuvanext.com/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>

      {/* Right - Unauthorized Content */}
      <div className="flex-1 flex items-center justify-center bg-white px-4 sm:px-6">
        <div className="w-full max-w-[474px]">
          <div className="bg-white rounded-[15px] px-6 sm:px-12 py-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                <ShieldX className="w-10 h-10 text-red-600" />
              </div>
            </div>

            <h1 className="text-[24px] font-bold text-[#1F2A37] mb-2">
              Access Denied
            </h1>

            <p className="text-[14px] text-[#9CA3AF] mb-1">
              You are not authorized to access this admin panel.
            </p>
            <p className="text-[13px] text-[#9CA3AF] mb-6">
              Only verified administrators can access this area.
            </p>

            <Button
              onClick={() => navigate("/signin")}
              className="w-full h-[35px] rounded-lg bg-[#76A9FA] text-white text-[14px] font-medium hover:opacity-90"
            >
              Back to Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
