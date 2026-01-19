import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Sparkles } from "lucide-react";
import {
  useCreateInternship,
  useGenerateAIContent,
} from "@/hooks/useInternships";
import { useUnits } from "@/hooks/useRecentUsers";
import {
  createInternshipSchema,
  type CreateInternshipFormType,
} from "@/lib/createInternshipSchema";
import type {
  CreateInternshipPayload,
  AISection,
} from "@/types/internship.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

interface CreateInternshipDialogProps {
  children?: React.ReactNode;
}

interface LanguageRequirement {
  language: string;
  read: boolean;
  write: boolean;
  speak: boolean;
}

const LANGUAGES = [
  "English",
  "Tamil",
  "Hindi",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Bengali",
  "Marathi",
];

export default function CreateInternshipDialog({
  children,
}: CreateInternshipDialogProps) {
  const [open, setOpen] = useState(false);
  const [aiLoadingField, setAiLoadingField] = useState<string | null>(null);
  const [languages, setLanguages] = useState<LanguageRequirement[]>([
    { language: "", read: false, write: false, speak: false },
  ]);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Use the requested hook for listing units
  const { data: units } = useUnits(1, 100);
  const { mutate: createInternship, isPending: isSubmitting } =
    useCreateInternship();
  const { mutateAsync: generateAIContent } = useGenerateAIContent();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CreateInternshipFormType>({
    resolver: zodResolver(createInternshipSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      duration: "",
      job_type: "full_time",
      isPaid: false,
      payment: "",
      min_age_required: "",
      description: "",
      responsibilities: "",
      benefits: "",
      skills_required: "",
      language_requirements: [],
      application_deadline: "",
      created_by: "",
    },
  });

  const jobTitle = watch("title");
  const isJobRoleFilled = jobTitle && jobTitle.trim().length > 0;

  // Date constants for deadline selection
  const currentYear = new Date().getFullYear();
  const monthNames = [
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
  ];
  const years = [currentYear, currentYear + 1, currentYear + 2];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleAIAssist = async (fieldName: keyof CreateInternshipFormType) => {
    if (!isJobRoleFilled) {
      toast.error("Please enter a Job role first");
      return;
    }

    setAiLoadingField(fieldName as string);

    try {
      const sectionMap: Record<string, AISection> = {
        description: "about",
        responsibilities: "key_responsibilities",
        benefits: "what_you_will_get",
        skills_required: "skills_required",
      };

      const section = sectionMap[fieldName];

      // 1. Call the mutation
      const result = await generateAIContent({
        title: jobTitle,
        sections: [section],
      });

      // DEBUG: Log the result to see the structure in your browser console
      console.log("AI API Result:", result);

      // 2. Access the data correctly based on your JSON structure
      // We check if result itself has the section, or if it's inside result.data
      const aiData = result?.data || result;
      const generatedValue = aiData[section];

      if (generatedValue) {
        // 3. Format the value (handling strings or arrays)
        const finalValue = Array.isArray(generatedValue)
          ? generatedValue.join("\n")
          : generatedValue;

        // 4. Update the form
        setValue(fieldName, finalValue.trim(), {
          shouldValidate: true,
          shouldDirty: true,
        });

        toast.success("AI content generated successfully!");
      } else {
        console.error("Content missing for section:", section, "in:", result);
        toast.error("AI returned a success message but the content was empty.");
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.error("Failed to connect to AI server. Check console for details.");
    } finally {
      setAiLoadingField(null);
    }
  };

  const handleLanguageChange = (
    index: number,
    field: keyof LanguageRequirement,
    value: string | boolean
  ) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index] = { ...updatedLanguages[index], [field]: value };
    setLanguages(updatedLanguages);
    setValue("language_requirements", updatedLanguages);
  };

  useEffect(() => {
    if (selectedDate && selectedMonth && selectedYear) {
      const formattedDate = `${selectedYear}-${selectedMonth.padStart(2, "0")}-${selectedDate.padStart(2, "0")}`;
      setValue("application_deadline", formattedDate);
    }
  }, [selectedDate, selectedMonth, selectedYear, setValue]);

  const onSubmit = (data: CreateInternshipFormType) => {
    const payload: CreateInternshipPayload = {
      title: data.title,
      description: data.description,
      duration: data.duration,
      payment: data.isPaid ? data.payment || "0" : "Unpaid",
      status: "active",
      closingDate: data.application_deadline,
      isPaid: data.isPaid,
      minAgeRequired: data.min_age_required,
      jobType: data.job_type,
      benefits: data.benefits.split("\n").filter((l) => l.trim()),
      skillsRequired: data.skills_required.split("\n").filter((l) => l.trim()),
      responsibilities: data.responsibilities
        .split("\n")
        .filter((l) => l.trim()),
      language: languages.map(
        (l) =>
          `${l.language} (Read: ${l.read}, Write: ${l.write}, Speak: ${l.speak})`
      ),
      createdBy: data.created_by,
    };

    createInternship(payload, {
      onSuccess: () => {
        setOpen(false);
        reset();
        toast.success("Internship created successfully");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-teal-600 hover:bg-teal-700 rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            Create New JD
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-3"></DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-140px)]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 space-y-6 pb-6"
          >
            <div>
              <DialogTitle className="text-xl font-semibold">
                Create new Job Description
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                This information is important for candidates to know better
                about Job/Internship
              </DialogDescription>
            </div>

            {/* Unit Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Unit *</Label>
              <Controller
                name="created_by"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="rounded-full">
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units?.map((unit) => (
                        <SelectItem key={unit.userId} value={unit.userId}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.created_by && (
                <p className="text-sm text-destructive">
                  {errors.created_by.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Job/Intern Role *
              </Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="title"
                    placeholder="Enter Job role"
                    className="rounded-full"
                  />
                )}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Internship Period *
              </Label>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Example: 3 months"
                    className="rounded-full"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Engagement Type *</Label>
              <Controller
                name="job_type"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-6">
                    {["full_time", "part_time", "both"].map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          value={type}
                          checked={field.value === type}
                          onChange={() => field.onChange(type)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm capitalize">
                          {type.replace("_", " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Internship Type *</Label>
              <div className="flex items-center gap-6">
                <Controller
                  name="isPaid"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => field.onChange(true)}
                        className={`rounded-full px-6 border ${field.value ? "bg-gray-200 text-black" : "bg-white text-black"}`}
                      >
                        Paid
                      </Button>
                      {field.value && (
                        <Controller
                          name="payment"
                          control={control}
                          render={({ field: payField }) => (
                            <Input
                              {...payField}
                              placeholder="e.g. 10000"
                              className="max-w-[200px] rounded-full"
                            />
                          )}
                        />
                      )}
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => field.onChange(false)}
                        className={`rounded-full px-6 border ${!field.value ? "bg-gray-200 text-black" : "bg-white text-black"}`}
                      >
                        Unpaid
                      </Button>
                    </>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Minimum Age Required *
              </Label>
              <Controller
                name="min_age_required"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[150px] rounded-full">
                      <SelectValue placeholder="Age" />
                    </SelectTrigger>
                    <SelectContent>
                      {[18, 19, 20, 21, 22, 23, 24, 25].map((age) => (
                        <SelectItem key={age} value={String(age)}>
                          {age}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* AI Assist Sections */}
            {[
              "description",
              "responsibilities",
              "benefits",
              "skills_required",
            ].map((field) => (
              <div key={field} className="space-y-2">
                <Label
                  htmlFor={field}
                  className="text-sm font-medium capitalize"
                >
                  {field.replace("_", " ")} *
                </Label>
                <Controller
                  name={field as any}
                  control={control}
                  render={({ field: controllerField }) => (
                    <div className="relative">
                      <Textarea
                        {...controllerField}
                        id={field}
                        className="min-h-[120px] rounded-2xl shadow-inner"
                      />
                      <Button
                        type="button"
                        size="sm"
                        className={`absolute bottom-2 right-2 rounded-full ${isJobRoleFilled ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-300"}`}
                        onClick={() => handleAIAssist(field as any)}
                        disabled={!isJobRoleFilled || aiLoadingField === field}
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        {aiLoadingField === field
                          ? "Generating..."
                          : "AI Assistant"}
                      </Button>
                    </div>
                  )}
                />
              </div>
            ))}

            <div className="space-y-4">
              <Label className="text-sm font-medium">
                Language Proficiency *
              </Label>
              {languages.map((lang, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Select
                    value={lang.language}
                    onValueChange={(val) =>
                      handleLanguageChange(index, "language", val)
                    }
                  >
                    <SelectTrigger className="w-[220px] rounded-full">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {["read", "write", "speak"].map((prof) => (
                    <div key={prof} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${prof}-${index}`}
                        checked={(lang as any)[prof]}
                        onCheckedChange={(checked) =>
                          handleLanguageChange(
                            index,
                            prof as any,
                            checked === true
                          )
                        }
                      />
                      <Label
                        htmlFor={`${prof}-${index}`}
                        className="text-sm font-normal capitalize"
                      >
                        {prof}
                      </Label>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Last date to apply *
              </Label>
              <div className="flex gap-3">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="flex-1 border rounded-full px-3 py-2 text-sm bg-white"
                >
                  <option value="">Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="flex-1 border rounded-full px-3 py-2 text-sm bg-white"
                >
                  <option value="">Month</option>
                  {monthNames.map((m, i) => (
                    <option key={m} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 border rounded-full px-3 py-2 text-sm bg-white"
                >
                  <option value="">Date</option>
                  {dates.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>

          <div className="px-6 py-4 flex justify-end">
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !isValid}
              className="rounded-3xl bg-teal-600 hover:bg-teal-700 px-10"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
