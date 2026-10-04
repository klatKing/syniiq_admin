import { useQuery } from "@tanstack/react-query";
import { useRealtime } from "../../../hooks/useRealtime";
import { getTestimonials } from "../services/avisService";

export function useTestimonials() {
  // Rafraîchit la liste quand un avis change (même depuis un autre poste)
  useRealtime("testimonials", ["testimonials"]);

  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data } = await getTestimonials();
      return data.testimonials; // { success, message, testimonials: [...] }
    },
  });
}