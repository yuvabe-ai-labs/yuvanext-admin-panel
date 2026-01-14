import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAddCompany } from "@/hooks/useUnitStats"; // Ensure this path is correct
import type { CompanyType } from "@/types/unitStats.types"; //

const companySchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyEmail: z.string().email("Invalid email").min(1, "Email is required"),
  contactNumber: z.string().min(8, "Contact number is required"),
  companyType: z.enum(["auroville", "non-auroville"], {
    message: "Company type is required",
  }),
  industryType: z.string().min(1, "Industry type is required"),
  address: z.string().min(1, "Address is required"),
  about: z.string().min(1, "About is required"),
  services: z.string().min(1, "Services offered is required"),
  achievements: z.string().min(1, "Achievements is required"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept terms and conditions",
  }),
});

type CompanyFormType = z.infer<typeof companySchema>;

export default function AddCompanyForm({ onClose }: { onClose: () => void }) {
  // Initialize the hook from useUnitStats.ts
  const { mutateAsync: addCompany, isPending } = useAddCompany();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CompanyFormType>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      terms: false,
    },
  });

  const onSubmit = async (data: CompanyFormType) => {
    try {
      // Data Mapping: Convert Form names to API names
      const payload = {
        companyName: data.companyName,
        companyEmail: data.companyEmail,
        contactNumber: data.contactNumber,
        // Convert UI labels to API enum values
        companyType: (data.companyType === "auroville"
          ? "auroville_unit"
          : "non_auroville_unit") as CompanyType,
        industryType: data.industryType,
        address: data.address,
        aboutCompany: data.about, // Maps form 'about' to API 'aboutCompany'
        serviceOffered: data.services, // Maps form 'services' to API 'serviceOffered'
        achievements: data.achievements,
        password: "", // Service layer handles DEFAULT_PASSWORD if this is empty
      };

      await addCompany(payload);
      toast.success("Company created successfully!");
      onClose();
    } catch (err: any) {
      console.error("Submission Error:", err);
      // Extracts error message from your api-handler
      toast.error(
        err?.message || "Failed to add company. Please check your inputs."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
      <div>
        <div className="mb-5">
          <h1 className="font-bold text-lg">Add Company</h1>
          <p className="text-xs">
            This information is essential for managing and displaying company
            details.
          </p>
        </div>

        <div className="space-y-5">
          {/* Company Name */}
          <div>
            <label className="font-bold text-gray-600 text-sm">
              Company Name *
            </label>
            <input
              className="w-full border border-gray-400 rounded-full mt-2.5 px-5 py-2 text-xs"
              placeholder="Enter company name"
              {...register("companyName")}
            />
            {errors.companyName && (
              <p className="text-red-500 text-xs mt-2 pl-4">
                {errors.companyName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="font-bold text-gray-600 text-sm">
              Company Email ID *
            </label>
            <input
              className="w-full border border-gray-400 rounded-full mt-2.5 px-5 py-2 text-xs"
              {...register("companyEmail")}
              placeholder="Enter email address"
            />
            {errors.companyEmail && (
              <p className="text-red-500 text-xs mt-2 pl-4">
                {errors.companyEmail.message}
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label className="font-bold text-gray-600 text-sm">
              Contact Number *
            </label>
            <input
              className="w-full border border-gray-400 rounded-full mt-2.5 px-5 py-2 text-xs"
              {...register("contactNumber")}
              placeholder="Enter contact number"
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-xs mt-2 pl-4">
                {errors.contactNumber.message}
              </p>
            )}
          </div>

          {/* Company Type */}
          <div>
            <label className="font-bold text-gray-600 text-sm">
              Company Type *
            </label>
            <div className="flex gap-3 mt-2.5">
              <button
                type="button"
                onClick={() =>
                  setValue("companyType", "auroville", { shouldValidate: true })
                }
                className={`border border-gray-400 px-3 py-1 rounded-full text-xs transition-colors ${
                  watch("companyType") === "auroville"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "text-gray-400"
                }`}
              >
                Auroville Unit
              </button>
              <button
                type="button"
                onClick={() =>
                  setValue("companyType", "non-auroville", {
                    shouldValidate: true,
                  })
                }
                className={`border border-gray-400 px-3 py-1 rounded-full text-xs transition-colors ${
                  watch("companyType") === "non-auroville"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "text-gray-400"
                }`}
              >
                Non Auroville Unit
              </button>
            </div>
            {errors.companyType && (
              <p className="text-red-500 text-xs mt-2 pl-4">
                {errors.companyType.message}
              </p>
            )}
          </div>

          {/* Industry Type */}
          <div>
            <label className="font-bold text-gray-600 text-sm">
              Industry Type *
            </label>
            <input
              className="w-full border border-gray-400 rounded-full mt-2.5 px-5 py-2 text-xs"
              {...register("industryType")}
              placeholder="Enter your company domain"
            />
            {errors.industryType && (
              <p className="text-red-500 text-xs mt-2 pl-4">
                {errors.industryType.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="font-bold text-gray-600 text-sm">
              Address of Company *
            </label>
            <textarea
              className="w-full border border-gray-400 rounded-lg mt-2.5 px-5 py-2 text-xs h-28"
              {...register("address")}
              placeholder="Type here"
            />
            {errors.address && (
              <p className="text-red-500 text-xs pl-4">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* About */}
          <div>
            <label className="font-bold text-gray-600 text-sm">
              About the Company *
            </label>
            <textarea
              className="w-full border border-gray-400 rounded-lg mt-2.5 px-5 py-2 text-xs h-28"
              {...register("about")}
              placeholder="Type here"
            />
            {errors.about && (
              <p className="text-red-500 text-xs pl-4">
                {errors.about.message}
              </p>
            )}
          </div>

          {/* Services */}
          <div>
            <label className="font-bold text-gray-600 text-sm">
              Service Offered *
            </label>
            <textarea
              className="w-full border border-gray-400 rounded-lg mt-2.5 px-5 py-2 text-xs h-28"
              {...register("services")}
              placeholder="Type here"
            />
            {errors.services && (
              <p className="text-red-500 text-xs pl-4">
                {errors.services.message}
              </p>
            )}
          </div>

          {/* Achievements */}
          <div>
            <label className="font-bold text-gray-600 text-sm">
              Achievements *
            </label>
            <textarea
              className="w-full border border-gray-400 rounded-lg mt-2.5 px-5 py-2 text-xs h-28"
              {...register("achievements")}
              placeholder="Type here"
            />
            {errors.achievements && (
              <p className="text-red-500 text-xs pl-4">
                {errors.achievements.message}
              </p>
            )}
          </div>

          {/* Terms */}
          <div>
            <label className="flex gap-2 items-center font-bold text-gray-600 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="w-3.5 h-3.5"
                {...register("terms")}
              />
              Terms & Conditions
            </label>
            <p className="text-xs font-bold text-blue-500 mt-2.5">
              By checking and clicking this box, you agree to our Terms &
              Conditions.
            </p>
            {errors.terms && (
              <p className="text-red-500 text-xs mt-2 pl-4">
                {errors.terms.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-7.5">
            <button
              type="button"
              onClick={onClose}
              className="bg-transparent text-sm border border-gray-400 px-4 py-2 rounded-full"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className={`bg-blue-500 text-white text-sm px-4 py-1 rounded-full min-w-[80px] ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPending ? "Inviting..." : "Invite"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
