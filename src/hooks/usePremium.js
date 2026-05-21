import { useEffect, useState } from "react";
import { getUserPlan, activatePremiumPlan } from "../services/premium";

export function usePremium(user) {
  const [premium, setPremium] = useState(false);
  const [planLoading, setPlanLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadPlan() {
      if (!user?.id) {
        setPremium(false);
        setPlanLoading(false);
        return;
      }

      try {
        setPlanLoading(true);
        const data = await getUserPlan(user.id);

        if (mounted) {
          setPremium(data?.is_premium === true);
        }
      } catch (error) {
        console.error("Erreur plan premium :", error);

        if (mounted) {
          setPremium(false);
        }
      } finally {
        if (mounted) {
          setPlanLoading(false);
        }
      }
    }

    loadPlan();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  async function enablePremium() {
    if (!user?.id) return false;

    try {
      await activatePremiumPlan(user.id);
      setPremium(true);
      return true;
    } catch (error) {
      console.error("Erreur activation premium :", error);
      return false;
    }
  }

  return { premium, setPremium, enablePremium, planLoading };
}
