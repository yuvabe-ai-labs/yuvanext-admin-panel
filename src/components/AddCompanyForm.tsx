import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

const companySchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyEmail: z.string().email("Invalid email").min(1, "Email is required"),
  contactNumber: z.string().min(8, "Contact number is required"),
  companyType: z
    .enum(["auroville", "non-auroville"])
    .refine((val) => val !== undefined, {
      message: "Company type is required",
    }),
  industryType: z.string().min(1, "Industry type is required"),

  companySize: z
    .enum(["1-25", "26-50", "51-100", "101-200", "200+"])
    .refine((val) => val !== undefined, {
      message: "Company size is required",
    })
    .optional(),
  address: z.string().min(1, "Address is required"),
  about: z.string().min(1, "About is required"),
  services: z.string().min(1, "Services offered is required"),
  achievements: z.string().min(1, "Achievements is required"),

  documents: z.array(z.any()).optional(), // file upload handling later

  language: z.string().min(1, "Select a language").optional(),
  languageAbilities: z.array(z.enum(["read", "write", "speak"])).optional(),

  registrationDate: z
    .object({
      day: z.string().min(1, "Day required"),
      month: z.string().min(1, "Month required"),
      year: z.string().min(1, "Year required"),
    })
    .optional(),

  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept terms and conditions",
  }),
});

type CompanyFormType = z.infer<typeof companySchema>;

export default function AddCompanyForm({ onClose }: { onClose: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CompanyFormType>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      languageAbilities: [],
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CompanyFormType) => {
    console.log("on submit triggered");
    setLoading(true);

    try {
      const password = "Yuvanext@25";
      const { data: user, error: userErr } = await supabase.auth.signUp({
        email: data.companyEmail,
        password,
      });

      if (userErr) throw userErr;

      console.log("new user sign up created successfully");

      const userId = user?.user?.id ?? "";
      console.log("USER ID:", userId);

      const { data: unitData, error: unitError } = await supabase.rpc(
        "create_unit" as any,
        {
          p_user_id: userId,
          p_unit_name: data.companyName,
          p_contact_email: data.companyEmail,
          p_contact_phone: data.contactNumber,
          p_address: data.address,
          p_industry: data.industryType,
          p_description: data.about,
          p_is_aurovillian: data.companyType === "auroville",
        }
      );
      console.log("Function call result:", unitData, unitError);

      if (unitError) {
        console.error("UNIT CREATION ERROR:", unitError);
        toast.error(unitError.message);
        setLoading(false);
        return;
      }
      console.log("Created Unit ID:", unitData);

      // send invite link to the new unit
      // const { data: verifyRes, error: verifyError } =
      //   await supabase.functions.invoke("send-verification-link", {
      //     body: {
      //       email: data.companyEmail,
      //       password: "Yuvanext@25",
      //       redirectUrl: "https://app.yuvanext.com/unit-dashboard",
      //     },
      //   });

      // console.log("VERIFY RESPONSE:", verifyRes, verifyError);

      alert("✅ Company successfully created!");

      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // const abilities = watch("languageAbilities");

  // const toggleAbility = (value: "read" | "write" | "speak") => {
  //   if (abilities.includes(value)) {
  //     setValue(
  //       "languageAbilities",
  //       abilities.filter((v) => v !== value)
  //     );
  //   } else {
  //     setValue("languageAbilities", [...abilities, value]);
  //   }
  // };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (err) => console.log("❌ Errors:", err))}
      className="space-y-6 p-4"
    >
      <div>
        <div className="mb-5">
          <h1 className="font-bold text-lg">Add Company</h1>
          <p className="text-xs">
            This information is essential for managing and displaying company
            details.
          </p>
        </div>

        <div>
          {/* Company Name */}
          <div className="mb-5">
            <label className="font-bold text-gray-600 text-sm">
              Company Name *
            </label>
            <input
              className="w-full border border-gray-400 rounded-full mt-2.5 px-5 py-2 placeholder:text-gray-400 text-xs"
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
          <div className="mb-5">
            <label className="font-bold text-gray-600 text-sm">
              Company Email ID *
            </label>
            <input
              className="w-full border border-gray-400 rounded-full mt-2.5 px-5 py-2 placeholder:text-gray-400 text-xs"
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
          <div className="mb-5">
            <label className="font-bold text-gray-600 text-sm">
              Contact Number *
            </label>
            <input
              className="w-full border border-gray-400 rounded-full mt-2.5 px-5 py-2 placeholder:text-gray-400 text-xs"
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
          <div className="mb-5">
            <label className="font-bold text-gray-600 text-sm">
              Company Type *
            </label>
            <div className="flex gap-3 mt-2.5">
              <button
                type="button"
                onClick={() => setValue("companyType", "auroville")}
                className={`border border-gray-400 px-3 py-1 rounded-full cursor-pointer placeholder:text-gray-400 text-xs text-gray-400 ${
                  watch("companyType") === "auroville"
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
              >
                Auroville Unit
              </button>
              <button
                type="button"
                onClick={() => setValue("companyType", "non-auroville")}
                className={`border border-gray-400 px-3 py-1 rounded-full cursor-pointer placeholder:text-gray-400 text-xs text-gray-400 ${
                  watch("companyType") === "non-auroville"
                    ? "bg-blue-500 text-white"
                    : ""
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
          <div className="mb-5">
            <label className="font-bold text-gray-600 text-sm">
              Industry Type *
            </label>
            <input
              className="w-full border border-gray-400 rounded-full mt-2.5 px-5 py-2 placeholder:text-gray-400 text-xs"
              {...register("industryType")}
              placeholder="Enter your company domain"
            />
            {errors.industryType && (
              <p className="text-red-500 text-xs mt-2 pl-4">
                {errors.industryType.message}
              </p>
            )}
          </div>

          {/* Company Size */}
          {/* <div className="mb-5">
            <label className="font-bold text-gray-600 text-sm">
              Company Size *
            </label>
            <div className="flex gap-2 mt-2.5 flex-wrap">
              {["1-25", "26-50", "51-100", "101-200", "200+"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setValue("companySize", s as any)}
                  className={`border border-gray-400 px-3 py-1 rounded-full cursor-pointer text-xs text-gray-400 ${
                    watch("companySize") === s ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {errors.companySize && (
              <p className="text-red-500 text-xs mt-2 pl-4">
                {errors.companySize.message}
              </p>
            )}
          </div> */}

          {/* Address */}
          <div className="mb-5">
            <label className="font-bold text-gray-600 text-sm">
              Address of Company *
            </label>
            <textarea
              className="w-full border border-gray-400 rounded-lg mt-2.5 px-5 py-2 placeholder:text-gray-400 text-xs h-28"
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
          <div className="mb-5">
            <label className="font-bold text-gray-600 text-sm">
              About the Company *
            </label>
            <textarea
              className="w-full border border-gray-400 rounded-lg mt-2.5 px-5 py-2 placeholder:text-gray-400 text-xs h-28"
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
          <div className="mb-5">
            <label className="font-bold text-gray-600 text-sm">
              Service Offered *
            </label>
            <textarea
              className="w-full border border-gray-400 rounded-lg mt-2.5 px-5 py-2 placeholder:text-gray-400 text-xs h-28"
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
          <div className="mb-5">
            <label className="font-bold text-gray-600 text-sm">
              Achievements *
            </label>
            <textarea
              className="w-full border border-gray-400 rounded-lg mt-2.5 px-5 py-2 placeholder:text-gray-400 text-xs h-28"
              {...register("achievements")}
              placeholder="Type here"
            />
            {errors.achievements && (
              <p className="text-red-500 text-xs pl-4">
                {errors.achievements.message}
              </p>
            )}
          </div>

          {/* Language Select */}
          {/* <div className="mb-5">
            <label className="font-bold text-gray-600 text-sm">
              Language Preferred *
            </label>
            <select className="input" {...register("language")}>
              <option value="">Select Language</option>
              <option value="english">English</option>
              <option value="tamil">Tamil</option>
              <option value="hindi">Hindi</option>
            </select>
            {errors.language && (
              <p className="text-red-500 text-xs mt-2 pl-4">
                {errors.language.message}
              </p>
            )}
          </div> */}

          {/* Abilities */}
          {/* <div className="mb-5">
            <label className="font-bold text-gray-600 text-sm">Abilities</label>
            <div className="flex gap-4 mt-2">
              {["read", "write", "speak"].map((ability) => (
                <label key={ability} className="flex gap-1 items-center">
                  <input
                    type="checkbox"
                    checked={abilities.includes(ability as any)}
                    onChange={() => toggleAbility(ability as any)}
                  />
                  {ability}
                </label>
              ))}
            </div>
            {errors.languageAbilities && (
              <p className="text-red-500 text-xs mt-2 pl-4">
                Select at least one ability
              </p>
            )}
          </div> */}

          {/* Date */}
          {/* <div className="mb-5">
            <label className="font-bold text-gray-600 text-sm">
              Date of Registration *
            </label>
            <div className="grid grid-cols-3 gap-3 mt-2.5">
              <select
                className="border border-gray-400 rounded-full px-5 py-2 text-gray-400"
                {...register("registrationDate.day")}
              >
                <option value="">Day</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </select>
              <select
                className="border border-gray-400 rounded-full px-5 py-2 text-gray-400"
                {...register("registrationDate.month")}
              >
                <option value="">Month</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <select
                className="border border-gray-400 rounded-full px-5 py-2 text-gray-400"
                {...register("registrationDate.year")}
              >
                <option value="">Year</option>
                {Array.from({ length: 50 }, (_, i) => 2025 - i).map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>

            {errors.registrationDate && (
              <p className="text-red-500 text-xs mt-2 pl-4">
                Complete registration date
              </p>
            )}
          </div> */}

          {/* Terms */}
          <div>
            <label className="flex gap-2 items-center font-bold text-gray-600 text-sm">
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
              disabled={loading}
              className={`bg-blue-500 text-white text-sm px-4 py-1 rounded-full cursor-pointer ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
