import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { useAddCompany } from "@/hooks/useUnitStats";
import type { CompanyType } from "@/types/unitStats.types";

const companySchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(100, "Company name must not exceed 100 characters"),
  companyEmail: z.string().min(1, "Email is required").email("Invalid email").max(100, "Email must not exceed 100 characters"),
  contactNumber: z.string().min(8, "Contact number is required").max(15, "Contact number must not exceed 15 digits").regex(/^\d+$/, "Contact number must contain only numbers"),
  companyType: z.enum(["auroville", "non-auroville"], {
    message: "Company type is required",
  }),
  industryType: z.string().min(1, "Industry type is required").max(100, "Industry type must not exceed 100 characters"),
  address: z.string().min(1, "Address is required").max(500, "Address must not exceed 500 characters"),
  about: z.string().min(1, "About is required").max(1000, "About must not exceed 1000 characters"),
  services: z.string().min(1, "Services ofered is required").max(1000, "Services must not exceed 1000 characters"),
  achievements: z.string().min(1, "Achievements is required").max(1000, "Achievements must not exceed 1000 characters"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept terms and conditions",
  }),
});
type CompanyFormType = z.infer<typeof companySchema>;

export default function AddCompanyForm({ onClose }: { onClose: () => void }) {
  const { mutateAsync: addCompany, isPending } = useAddCompany();

  const form = useForm<CompanyFormType>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: "",
      companyEmail: "",
      contactNumber: "",
      industryType: "",
      address: "",
      about: "",
      services: "",
      achievements: "",
      terms: false,
    },
  });

  const onSubmit = async (data: CompanyFormType) => {
    try {
      const payload = {
        name: data.companyName,
        email: data.companyEmail,
        contactNumber: data.contactNumber,
        companyType: (data.companyType === "auroville"
          ? "auroville_unit"
          : "non_auroville_unit") as CompanyType,
        industryType: data.industryType,
        address: data.address,
        aboutCompany: data.about,
        serviceOffered: data.services,
        achievements: data.achievements,
      };

      await addCompany(payload);
      toast.success("Company Invited successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to add company.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
        <div>
          <div className="mb-5">
            <h1 className="font-bold text-lg">Add Company</h1>
            <p className="text-xs text-muted-foreground">
              This information is essential for managing and displaying company
              details.
            </p>
          </div>

          <div className="space-y-5">
            {/* Company Name */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-gray-600">
                    Company Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter company name"
                      {...field}
                      className="rounded-full"
                      maxLength={100}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="companyEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-gray-600">
                    Company Email ID *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email address"
                      {...field}
                      className="rounded-full"
                      maxLength={100}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact */}
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-gray-600">
                    Contact Number *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter contact number"
                      {...field}
                      className="rounded-full"
                      maxLength={15}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Company Type */}
            <FormField
              control={form.control}
              name="companyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-gray-600">
                    Company Type *
                  </FormLabel>
                  <div className="flex gap-3 mt-2">
                    <Button
                      type="button"
                      variant={
                        field.value === "auroville" ? "default" : "outline"
                      }
                      className="rounded-full text-xs h-8"
                      onClick={() => field.onChange("auroville")}
                    >
                      Auroville Unit
                    </Button>
                    <Button
                      type="button"
                      variant={
                        field.value === "non-auroville" ? "default" : "outline"
                      }
                      className="rounded-full text-xs h-8"
                      onClick={() => field.onChange("non-auroville")}
                    >
                      Non Auroville Unit
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Industry Type */}
            <FormField
              control={form.control}
              name="industryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-gray-600">
                    Industry Type *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your company domain"
                      {...field}
                      className="rounded-full"
                      maxLength={100}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-gray-600">
                    Address of Company *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type here"
                      {...field}
                      className="min-h-[100px]"
                      maxLength={500}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* About */}
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-gray-600">
                    About the Company *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type here"
                      {...field}
                      className="min-h-[100px]"
                      maxLength={1000}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Services Offered - ADDED MISSING FIELD */}
            <FormField
              control={form.control}
              name="services"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-gray-600">
                    Services Offered *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type here"
                      {...field}
                      className="min-h-[100px]"
                      maxLength={1000}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Achievements - ADDED MISSING FIELD */}
            <FormField
              control={form.control}
              name="achievements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-gray-600">
                    Achievements *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type here"
                      {...field}
                      className="min-h-[100px]"
                      maxLength={1000}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terms */}
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-bold text-gray-600">
                        Terms & Conditions
                      </FormLabel>
                      <p className="text-xs font-bold text-blue-500">
                        By checking and clicking this box, you agree to our
                        Terms & Conditions.
                      </p>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-full h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="rounded-full h-9 min-w-[100px]"
              >
                {isPending ? "Inviting..." : "Invite"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}