"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateBookingStatus } from "@/app/actions/booking";
import { useToast } from "@/hooks/use-toast";

interface StatusActionCellProps {
  id: string;
  currentStatus: string;
}

export default function StatusActionCell({ id, currentStatus }: StatusActionCellProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    setIsPending(true);
    try {
      const result = await updateBookingStatus(id, newStatus);
      if (result.success) {
        toast({
          title: "Berhasil",
          description: "Status permohonan telah diperbarui.",
        });
        router.refresh();
      } else {
        toast({
          title: "Gagal",
          description: result.error || "Gagal memperbarui status.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui status.",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={handleStatusChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[180px] h-8 text-xs">
        <SelectValue placeholder="Pilih Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Menunggu Verifikasi" className="text-xs">Menunggu Verifikasi</SelectItem>
        <SelectItem value="Disetujui" className="text-xs">Disetujui</SelectItem>
        <SelectItem value="Dibatalkan" className="text-xs">Dibatalkan</SelectItem>
        <SelectItem value="Selesai" className="text-xs">Selesai</SelectItem>
      </SelectContent>
    </Select>
  );
}
