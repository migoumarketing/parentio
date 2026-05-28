import { useEffect, useState } from "react";
import {
  listCoparentInvitations,
  inviteCoparent,
  updateCoparentInvitation,
  deleteCoparentInvitation
} from "../services/coparent";

async function sendCoparentEmail({ to, inviterEmail, permission }) {
  const response = await fetch("/api/send-invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      to,
      inviterEmail,
      permission
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Erreur envoi email");
  }

  return data;
}

export function useCoparent(user) {
  const [coparents, setCoparents] = useState([]);
  const [loadingCoparents, setLoadingCoparents] = useState(false);
  const [coparentError, setCoparentError] = useState(null);

  const userEmail = user?.email || "";

  async function loadCoparents() {
    if (!userEmail) {
      setCoparents([]);
      return [];
    }

    try {
      setLoadingCoparents(true);
      setCoparentError(null);

      const data = await listCoparentInvitations(userEmail);

      setCoparents(Array.isArray(data) ? data : []);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erreur chargement co-parent :", error);
      setCoparentError(error.message || "Erreur co-parent");
      setCoparents([]);
      return [];
    } finally {
      setLoadingCoparents(false);
    }
  }

  async function sendInvitation(coparentEmail, permission = "read") {
    try {
      setCoparentError(null);

      const cleanEmail = String(coparentEmail || "")
        .trim()
        .toLowerCase();

      if (!cleanEmail) {
        throw new Error("Email co-parent manquant.");
      }

      const invitation = await inviteCoparent({
        ownerId: user?.id,
        ownerEmail: userEmail,
        coparentEmail: cleanEmail,
        permission
      });

      try {
        await sendCoparentEmail({
          to: cleanEmail,
          inviterEmail: userEmail,
          permission
        });
      } catch (emailError) {
        console.error("Invitation créée mais email non envoyé :", emailError);
        setCoparentError(
          "Invitation créée, mais email non envoyé : " + emailError.message
        );
      }

      await loadCoparents();
      return invitation || true;
    } catch (error) {
      console.error("Erreur invitation co-parent :", error);
      setCoparentError(error.message || "Erreur invitation");
      return false;
    }
  }

  async function acceptInvitation(invitationId) {
    try {
      setCoparentError(null);

      await updateCoparentInvitation(
        invitationId,
        "accepted",
        user
      );

      await loadCoparents();
      return true;
    } catch (error) {
      console.error("Erreur acceptation co-parent :", error);
      setCoparentError(error.message || "Erreur acceptation");
      return false;
    }
  }

  async function refuseInvitation(invitationId) {
    try {
      setCoparentError(null);

      await updateCoparentInvitation(
        invitationId,
        "refused",
        user
      );

      await loadCoparents();
      return true;
    } catch (error) {
      console.error("Erreur refus co-parent :", error);
      setCoparentError(error.message || "Erreur refus");
      return false;
    }
  }

  async function removeInvitation(invitationId) {
    try {
      setCoparentError(null);

      await deleteCoparentInvitation(invitationId);

      await loadCoparents();
      return true;
    } catch (error) {
      console.error("Erreur suppression co-parent :", error);
      setCoparentError(error.message || "Erreur suppression");
      return false;
    }
  }

  useEffect(() => {
    loadCoparents();
  }, [userEmail]);

  const connected = coparents.some(
    (item) => item.status === "accepted"
  );

  return {
    coparents,
    loadingCoparents,
    coparentError,
    connected,
    loadCoparents,
    sendInvitation,
    acceptInvitation,
    refuseInvitation,
    removeInvitation
  };
}
