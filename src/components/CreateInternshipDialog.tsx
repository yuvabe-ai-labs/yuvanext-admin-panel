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
import { Plus, X, Sparkles, ChevronDown } from "lucide-react";
import { useCreateInternshipForUnit, useUnits } from "@/hooks/useInternships";
import type { InternshipCreateInput } from "@/types/internship.types";

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
  const [isPaidState, setIsPaidState] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [languages, setLanguages] = useState<LanguageRequirement[]>([
    { language: "", read: false, write: false, speak: false },
  ]);

  // Date states
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const { data: unitsData } = useUnits();
  const units = unitsData?.data || [];

  const { mutate: createInternship, isPending: isSubmitting } =
    useCreateInternshipForUnit();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<any>({
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
  const isPaid = watch("isPaid");
  const isJobRoleFilled = jobTitle && jobTitle.trim().length > 0;

  // Generate years (current year + next 2 years)
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();
  const years = [currentYear, currentYear + 1, currentYear + 2];

  // Generate months based on selected year
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

  const availableMonths =
    selectedYear && parseInt(selectedYear) === currentYear
      ? monthNames.slice(currentMonth - 1)
      : monthNames;

  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  const isDateDisabled = (date: number, month: string, year: string) => {
    if (!month || !year) return false;
    if (parseInt(year) === currentYear && parseInt(month) === currentMonth) {
      return date <= currentDay;
    }
    return false;
  };

  // Update application_deadline when date changes
  useEffect(() => {
    if (selectedDate && selectedMonth && selectedYear) {
      const formattedDate = `${selectedYear}-${selectedMonth.padStart(
        2,
        "0"
      )}-${selectedDate.padStart(2, "0")}`;
      setValue("application_deadline", formattedDate);
    }
  }, [selectedDate, selectedMonth, selectedYear, setValue]);

  const handleAddLanguage = () => {
    setLanguages([
      ...languages,
      { language: "", read: false, write: false, speak: false },
    ]);
  };

  const handleRemoveLanguage = (index: number) => {
    if (languages.length > 1) {
      setLanguages(languages.filter((_, i) => i !== index));
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

  const handleAIAssist = async (field: string) => {
    if (!isJobRoleFilled) return;

    setAiLoading(field);

    // Simulate AI generation - replace with actual API call
    setTimeout(() => {
      let generatedText = "";

      switch (field) {
        case "description":
          generatedText = `We are seeking a talented ${jobTitle} to join our team. This role offers an excellent opportunity to work on challenging projects and develop your skills in a professional environment.`;
          break;
        case "responsibilities":
          generatedText = `• Collaborate with team members on various projects\n• Contribute to the development and implementation of solutions\n• Participate in team meetings and brainstorming sessions\n• Learn and apply industry best practices`;
          break;
        case "benefits":
          generatedText = `• Certificate of completion\n• Letter of recommendation\n• Hands-on experience with real projects\n• Mentorship from experienced professionals\n• Networking opportunities`;
          break;
        case "skills_required":
          generatedText = `• Strong communication skills\n• Ability to work in a team\n• Problem-solving mindset\n• Eagerness to learn\n• Attention to detail`;
          break;
      }

      setValue(field, generatedText);
      setAiLoading(null);
    }, 1500);
  };

  const onSubmit = (data: any) => {
    // Convert text fields to arrays where needed
    const internshipData: InternshipCreateInput = {
      title: data.title,
      company_name:
        units.find((u) => u.profile_id === data.created_by)?.unit_name ||
        "Company",
      duration: data.duration,
      payment: data.isPaid ? data.payment : "Unpaid",
      job_type: data.job_type,
      min_age_required: data.min_age_required,
      description: data.description,
      responsibilities: data.responsibilities
        ?.split("\n")
        .filter((line: string) => line.trim()),
      benefits: data.benefits
        ?.split("\n")
        .filter((line: string) => line.trim()),
      skills_required: data.skills_required
        ?.split("\n")
        .filter((line: string) => line.trim()),
      application_deadline: data.application_deadline,
      created_by: data.created_by,
      status: "active",
    };

    createInternship(internshipData, {
      onSuccess: () => {
        setOpen(false);
        handleClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    setIsPaidState(false);
    setLanguages([{ language: "", read: false, write: false, speak: false }]);
    setSelectedYear("");
    setSelectedMonth("");
    setSelectedDate("");
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
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold">
                  Create new Job Description
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  This information is important for candidates to know better
                  about Job/Internship
                </DialogDescription>
              </div>
            </div>

            {/* Unit Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Select Unit <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="created_by"
                control={control}
                rules={{ required: "Unit is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="rounded-full">
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.profile_id}>
                          {unit.unit_name || "Unnamed Unit"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.created_by && (
                <p className="text-sm text-destructive">
                  {errors.created_by.message as string}
                </p>
              )}
            </div>

            {/* Job/Intern Role */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Job/Intern Role <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Job role is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="title"
                    placeholder="Enter Job role"
                    className="bg-background rounded-full"
                  />
                )}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message as string}
                </p>
              )}
            </div>

            {/* Internship Period */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Internship Period <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="duration"
                control={control}
                rules={{ required: "Duration is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="duration"
                    placeholder="Example: 3 months / 1 month"
                    className="bg-background rounded-full"
                  />
                )}
              />
              {errors.duration && (
                <p className="text-sm text-destructive">
                  {errors.duration.message as string}
                </p>
              )}
            </div>

            {/* Job Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Engagement Type <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="job_type"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="full_time"
                        checked={field.value === "full_time"}
                        onChange={() => field.onChange("full_time")}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm">Full Time</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="part_time"
                        checked={field.value === "part_time"}
                        onChange={() => field.onChange("part_time")}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm">Part Time</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="both"
                        checked={field.value === "both"}
                        onChange={() => field.onChange("both")}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm">Both</span>
                    </label>
                  </div>
                )}
              />
            </div>

            {/* Internship Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Internship Type <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-6">
                <Controller
                  name="isPaid"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          field.onChange(true);
                          setIsPaidState(true);
                        }}
                        className={`rounded-full px-6 border border-black ${
                          field.value
                            ? "bg-gray-200 text-black hover:bg-gray-300 hover:!text-black"
                            : "bg-white text-black hover:bg-gray-100 hover:!text-black"
                        }`}
                      >
                        Paid
                      </Button>

                      {field.value && (
                        <Controller
                          name="payment"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="text"
                              placeholder="e.g. 10000 or To be discussed"
                              className="max-w-[200px] rounded-full"
                            />
                          )}
                        />
                      )}

                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          field.onChange(false);
                          setIsPaidState(false);
                        }}
                        className={`rounded-full px-6 border border-black ${
                          !field.value
                            ? "bg-gray-200 text-black hover:bg-gray-300 hover:!text-black"
                            : "bg-white text-black hover:bg-gray-100 hover:!text-black"
                        }`}
                      >
                        Unpaid
                      </Button>
                    </>
                  )}
                />
              </div>
            </div>

            {/* Minimum Age Required */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Minimum Age Required <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="min_age_required"
                control={control}
                rules={{ required: "Age is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[150px] rounded-full">
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => {
                        const age = 16 + i;
                        return (
                          <SelectItem key={age} value={String(age)}>
                            {age}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.min_age_required && (
                <p className="text-sm text-destructive">
                  {errors.min_age_required.message as string}
                </p>
              )}
            </div>

            {/* About Internship */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                About Internship <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <div className="relative">
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="Type here"
                      className="min-h-[120px] bg-background resize-none rounded-2xl"
                    />
                    <Button
                      type="button"
                      size="sm"
                      className={`absolute bottom-2 right-2 rounded-full ${
                        isJobRoleFilled
                          ? "bg-teal-600 hover:bg-teal-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      onClick={() => handleAIAssist("description")}
                      disabled={!isJobRoleFilled || aiLoading === "description"}
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      {aiLoading === "description"
                        ? "Generating..."
                        : "AI Assistant"}
                    </Button>
                  </div>
                )}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message as string}
                </p>
              )}
            </div>

            {/* Key Responsibilities */}
            <div className="space-y-2">
              <Label htmlFor="responsibilities" className="text-sm font-medium">
                Key Responsibilities <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="responsibilities"
                control={control}
                rules={{ required: "Responsibilities are required" }}
                render={({ field }) => (
                  <div className="relative">
                    <Textarea
                      {...field}
                      id="responsibilities"
                      placeholder="Type here"
                      className="min-h-[120px] bg-background resize-none rounded-2xl"
                    />
                    <Button
                      type="button"
                      size="sm"
                      className={`absolute bottom-2 right-2 rounded-full ${
                        isJobRoleFilled
                          ? "bg-teal-600 hover:bg-teal-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      onClick={() => handleAIAssist("responsibilities")}
                      disabled={
                        !isJobRoleFilled || aiLoading === "responsibilities"
                      }
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      {aiLoading === "responsibilities"
                        ? "Generating..."
                        : "AI Assistant"}
                    </Button>
                  </div>
                )}
              />
              {errors.responsibilities && (
                <p className="text-sm text-destructive">
                  {errors.responsibilities.message as string}
                </p>
              )}
            </div>

            {/* Post Internship Benefits */}
            <div className="space-y-2">
              <Label htmlFor="benefits" className="text-sm font-medium">
                What you will get (Post Internship){" "}
                <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="benefits"
                control={control}
                rules={{ required: "Benefits are required" }}
                render={({ field }) => (
                  <div className="relative">
                    <Textarea
                      {...field}
                      id="benefits"
                      placeholder="Type here"
                      className="min-h-[120px] bg-background resize-none rounded-2xl"
                    />
                    <Button
                      type="button"
                      size="sm"
                      className={`absolute bottom-2 right-2 rounded-full ${
                        isJobRoleFilled
                          ? "bg-teal-600 hover:bg-teal-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      onClick={() => handleAIAssist("benefits")}
                      disabled={!isJobRoleFilled || aiLoading === "benefits"}
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      {aiLoading === "benefits"
                        ? "Generating..."
                        : "AI Assistant"}
                    </Button>
                  </div>
                )}
              />
              {errors.benefits && (
                <p className="text-sm text-destructive">
                  {errors.benefits.message as string}
                </p>
              )}
            </div>

            {/* Skills Required */}
            <div className="space-y-2">
              <Label htmlFor="skills_required" className="text-sm font-medium">
                Skills Required <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="skills_required"
                control={control}
                rules={{ required: "Skills are required" }}
                render={({ field }) => (
                  <div className="relative">
                    <Textarea
                      {...field}
                      id="skills_required"
                      placeholder="Type here"
                      className="min-h-[120px] bg-background resize-none rounded-2xl"
                    />
                    <Button
                      type="button"
                      size="sm"
                      className={`absolute bottom-2 right-2 rounded-full ${
                        isJobRoleFilled
                          ? "bg-teal-600 hover:bg-teal-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      onClick={() => handleAIAssist("skills_required")}
                      disabled={
                        !isJobRoleFilled || aiLoading === "skills_required"
                      }
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      {aiLoading === "skills_required"
                        ? "Generating..."
                        : "AI Assistant"}
                    </Button>
                  </div>
                )}
              />
              {errors.skills_required && (
                <p className="text-sm text-destructive">
                  {errors.skills_required.message as string}
                </p>
              )}
            </div>

            {/* Language Proficiency */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">
                Language Proficiency <span className="text-destructive">*</span>
              </Label>
              {languages.map((lang, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Select
                    value={lang.language}
                    onValueChange={(value) =>
                      handleLanguageChange(index, "language", value)
                    }
                  >
                    <SelectTrigger className="w-[220px] bg-background">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((language) => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`read-${index}`}
                      checked={lang.read}
                      onCheckedChange={(checked) =>
                        handleLanguageChange(index, "read", checked === true)
                      }
                    />
                    <label
                      htmlFor={`read-${index}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Read
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`write-${index}`}
                      checked={lang.write}
                      onCheckedChange={(checked) =>
                        handleLanguageChange(index, "write", checked === true)
                      }
                    />
                    <label
                      htmlFor={`write-${index}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Write
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`speak-${index}`}
                      checked={lang.speak}
                      onCheckedChange={(checked) =>
                        handleLanguageChange(index, "speak", checked === true)
                      }
                    />
                    <label
                      htmlFor={`speak-${index}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Speak
                    </label>
                  </div>

                  {languages.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveLanguage(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="link"
                onClick={handleAddLanguage}
                className="text-primary pl-0"
              >
                Add another language
              </Button>
            </div>

            {/* Last date to apply */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Last date to apply <span className="text-destructive">*</span>
              </label>

              <div className="flex gap-3">
                <div className="relative flex-1">
                  <select
                    value={selectedYear}
                    onChange={(e) => {
                      setSelectedYear(e.target.value);
                      setSelectedMonth("");
                      setSelectedDate("");
                    }}
                    className="w-full px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-full appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-9"
                  >
                    <option value="">Year</option>
                    {years.map((year) => (
                      <option key={year} value={year} className="text-gray-700">
                        {year}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative flex-1">
                  <select
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      setSelectedDate("");
                    }}
                    disabled={!selectedYear}
                    className="w-full px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-full appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-9 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Month</option>
                    {availableMonths.map((month, index) => {
                      const monthValue =
                        selectedYear && parseInt(selectedYear) === currentYear
                          ? currentMonth + index
                          : index + 1;
                      return (
                        <option
                          key={month}
                          value={monthValue}
                          className="text-gray-700"
                        >
                          {month}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative flex-1">
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    disabled={!selectedMonth || !selectedYear}
                    className="w-full px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-full appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-9 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Date</option>
                    {dates.map((date) => {
                      const disabled = isDateDisabled(
                        date,
                        selectedMonth,
                        selectedYear
                      );
                      return (
                        <option
                          key={date}
                          value={date}
                          disabled={disabled}
                          className={
                            disabled ? "text-gray-400" : "text-gray-700"
                          }
                        >
                          {date}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {selectedDate && selectedMonth && selectedYear && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {selectedDate}/{selectedMonth}/{selectedYear}
                </p>
              )}

              {errors.application_deadline && (
                <p className="text-sm text-destructive">
                  {errors.application_deadline.message as string}
                </p>
              )}
            </div>
          </form>

          <div className="px-6 py-4 flex justify-end">
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !isValid}
              className="rounded-3xl bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
