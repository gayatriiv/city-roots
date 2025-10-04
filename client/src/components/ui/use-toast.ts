import { useCallback } from "react";

export function useToast() {
  const toast = useCallback(
    ({ title, description, variant }: { title: string; description?: string; variant?: string }) => {
      window.alert(`${title}${description ? "\n" + description : ""}`);
    },
    []
  );
  return { toast };
}