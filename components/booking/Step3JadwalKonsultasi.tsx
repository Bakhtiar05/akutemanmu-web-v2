import { useEffect, useState, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { BookingFormData } from "@/lib/schemas/booking";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfWeek, addWeeks, isSameWeek, isBefore, startOfDay, getDay, isAfter, endOfWeek, addDays } from "date-fns";
import { getBookedSlots } from "@/app/actions/booking";
import { Loader2 } from "lucide-react";
import { toZonedTime } from "date-fns-tz";

const TIME_SLOTS = [
  "09:00 WIB",
  "10:00 WIB",
  "11:00 WIB",
  "13:00 WIB",
  "14:00 WIB",
  "15:00 WIB",
];

export function Step3JadwalKonsultasi() {
  const { control, setValue } = useFormContext<BookingFormData>();
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const selectedDate = useWatch({ control, name: "tanggal_konsultasi" });

  const fetchBookedSlots = useCallback(async (date: Date) => {
    setIsLoadingSlots(true);
    try {
      const slots = await getBookedSlots(date);
      setBookedSlots(slots);
    } catch (e) {
      console.error(e);
      setBookedSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
      // Reset time when date changes
      setValue("waktu_konsultasi", "");
    }
  }, [selectedDate, fetchBookedSlots, setValue]);

  // Handle Timezone and Date constraints
  const now = new Date();
  // Ensure we evaluate "today" based on Jakarta time
  const nowWib = toZonedTime(now, "Asia/Jakarta");
  
  // Set minimum date to tomorrow
  const minDate = addDays(startOfDay(nowWib), 1);

  const isDateDisabled = (date: Date) => {
    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const day = getDay(date);
    
    // Only allow Tue (2), Wed (3), Thu (4), Fri (5)
    if (day < 2 || day > 5) return true;

    // Must be strictly from tomorrow onwards
    if (isBefore(date, minDate)) {
      return true;
    }

    return false;
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Calendar Selection */}
        <FormField
          control={control}
          name="tanggal_konsultasi"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal Konsultasi *</FormLabel>
              <FormDescription>Pilih hari antara Selasa - Jumat.</FormDescription>
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 inline-block shadow-sm w-fit">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={isDateDisabled}
                  className="mx-auto"
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Time Slot Selection */}
        <FormField
          control={control}
          name="waktu_konsultasi"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Waktu Konsultasi *</FormLabel>
              <FormDescription>Zona waktu WIB (GMT+7)</FormDescription>
              {!selectedDate ? (
                <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center text-[15px] text-[#64748B]">
                  Pilih tanggal terlebih dahulu untuk melihat ketersediaan waktu.
                </div>
              ) : isLoadingSlots ? (
                <div className="flex h-[200px] flex-col items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500 mb-2" />
                  <p className="text-sm text-neutral-500">Memeriksa ketersediaan jadwal...</p>
                </div>
              ) : (
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-2 gap-4"
                  >
                    {TIME_SLOTS.map((time) => {
                      const isBooked = bookedSlots.includes(time);
                      return (
                        <FormItem key={time}>
                          <FormControl>
                            <RadioGroupItem value={time} className="peer sr-only" disabled={isBooked} />
                          </FormControl>
                          <FormLabel
                            className={`flex flex-col items-center justify-center rounded-xl border-2 p-4 text-sm font-medium transition-all duration-200
                              ${isBooked 
                                ? "border-[#E2E8F0] bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed opacity-60" 
                                : "border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] hover:border-[#CBD5E1] peer-data-[state=checked]:border-[#2563EB] peer-data-[state=checked]:bg-[#EFF6FF] peer-data-[state=checked]:text-[#1D4ED8] cursor-pointer"
                              }
                            `}
                          >
                            {time}
                            {isBooked && <span className="text-[10px] mt-1 text-red-500 font-semibold">Penuh</span>}
                          </FormLabel>
                        </FormItem>
                      )
                    })}
                  </RadioGroup>
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="metode_konsultasi"
        render={({ field }) => (
          <FormItem className="space-y-3 pt-8 border-t border-[#E2E8F0]">
            <FormLabel>Metode Konsultasi *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="Online" className="peer sr-only" />
                  </FormControl>
                  <FormLabel className="flex flex-col rounded-xl border-2 border-[#E2E8F0] bg-white p-5 hover:bg-[#F8FAFC] hover:border-[#CBD5E1] peer-data-[state=checked]:border-[#2563EB] peer-data-[state=checked]:bg-[#EFF6FF] cursor-pointer transition-all duration-200">
                    <span className="font-semibold text-base mb-1">Online</span>
                    <span className="text-sm font-normal text-neutral-500">Google Meet</span>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="Offline" className="peer sr-only" />
                  </FormControl>
                  <FormLabel className="flex flex-col rounded-xl border-2 border-[#E2E8F0] bg-white p-5 hover:bg-[#F8FAFC] hover:border-[#CBD5E1] peer-data-[state=checked]:border-[#2563EB] peer-data-[state=checked]:bg-[#EFF6FF] cursor-pointer transition-all duration-200">
                    <span className="font-semibold text-base mb-1">Offline</span>
                    <span className="text-sm font-normal text-neutral-500">Hanya tersedia di Kota Serang, Banten</span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
