import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/ui/use-toast";
import { signInSchema } from "@/lib/schema";
import signupIllustrate from "@/assets/signinillustion.png";
import signinLogo from "@/assets/signinLogo.svg";
import { Eye, EyeOff } from "lucide-react";

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      keepLoggedIn: false,
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      // Sign in with Better Auth
      const { data: authData, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.keepLoggedIn,
      });

      if (error) {
        // Handle authentication errors
        let errorMessage = error.message || "Invalid email or password.";
        let errorTitle = "Sign in failed";

        if (error.status === 401) {
          errorMessage =
            "Incorrect email or password. Please check your credentials.";
        } else if (error.status === 403) {
          errorMessage = "Please verify your email before signing in.";
          errorTitle = "Verification Required";
        } else if (error.status === 429) {
          errorMessage = "Too many login attempts. Please try again later.";
        }

        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      const user = authData?.user as { role?: string };

      if (!user || user.role !== "admin") {
        await authClient.signOut();

        toast({
          title: "Access Denied",
          description: "You are not authorized to access the admin panel.",
          variant: "destructive",
        });
        navigate("/unauthorized");
        return;
      }

      // Successful admin login
      toast({
        title: "Welcome!",
        description: "Admin login successful.",
      });

      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Illustration */}
      <div className="hidden lg:flex w-[41%] h-screen relative p-4">
        <div className="w-full h-full rounded-3xl overflow-hidden relative">
          <img
            src={signupIllustrate}
            alt="Signin Illustration"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 px-8">
            <img src={signinLogo} alt="Sign in Logo" className="w-28 h-auto" />
            <p className="text-white text-base font-medium max-w-xl leading-relaxing">
              Welcome to the Admin Panel. Only verified admins can log in here.
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

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-4 sm:px-6">
        <div className="w-full max-w-[474px]">
          <div className="bg-white rounded-[15px] px-6 sm:px-12 py-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-[24px] font-bold text-[#1F2A37]">
                Admin Sign In
              </h1>
              <p className="text-[14px] text-[#9CA3AF]">
                Sign in using your admin account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-[14px] mb-2 text-[#4B5563]">
                  Email Address *
                </label>
                <div
                  className={`border ${
                    errors.email ? "border-red-500" : "border-[#D1D5DB]"
                  } rounded-lg h-8 px-4 flex items-center`}
                >
                  <input
                    type="email"
                    placeholder="Enter email address"
                    {...register("email")}
                    className="w-full text-[13px] outline-none bg-transparent placeholder-[#D1D5DB]"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[14px] mb-2 text-[#4B5563]">
                  Password *
                </label>
                <div
                  className={`border ${
                    errors.password ? "border-red-500" : "border-[#D1D5DB]"
                  } rounded-lg h-8 px-4 flex items-center gap-2`}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className="w-full text-[13px] outline-none bg-transparent placeholder-[#D1D5DB]"
                    disabled={isSubmitting}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#9CA3AF] hover:text-[#4B5563]"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Keep me logged in */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("keepLoggedIn")}
                  className="w-3 h-3"
                />
                <label className="text-[13px] text-[#4B5563]">
                  Keep me logged in
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[35px] rounded-lg bg-[#76A9FA] text-white text-[14px] font-medium hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
