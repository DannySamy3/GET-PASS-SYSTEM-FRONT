import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "@/utils/toastSlice";
import { getSponsors, deleteSponsors } from "@/utils/sponsorController";
import {
  getAllPaymentSessions,
  createPaymentSession,
  updatePaymentSession,
  deletePaymentSession,
} from "@/utils/paymentSessionController";
import type {
  SponsorData,
  ApiResponse,
  PaymentSessionWithEditing,
  NewSessionData,
  CreatePaymentSessionData,
} from "@/types/sponsor.types";

export const useSponsors = () => {
  const dispatch = useDispatch();
  const [sponsors, setSponsors] = useState<SponsorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentSessions, setPaymentSessions] = useState<
    PaymentSessionWithEditing[]
  >([]);
  const [currentSession, setCurrentSession] = useState<string>("");
  const [isSessionUpdating, setIsSessionUpdating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const fetchSponsors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = (await getSponsors()) as ApiResponse;
      if (response && response.data) {
        setSponsors(response.data.data || []);
      }
    } catch (error) {
      setError("Failed to fetch sponsors. Please try again later.");
      console.error("Error fetching sponsors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPaymentSessions = async () => {
    try {
      const response = await getAllPaymentSessions();
      if (response?.data?.data) {
        //@ts-ignore
        const sessions = response.data.data.sessions.map(
          (session: PaymentSessionWithEditing) => ({
            ...session,
            _id: session._id,
            isEditing: false,
          })
        );
        setPaymentSessions(sessions);

        const activeSession = sessions.find(
          (session: PaymentSessionWithEditing) => session.activeStatus === true
        );
        setCurrentSession(activeSession ? activeSession._id : "");
      }
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({
          message:
            err.response?.data?.message || "Failed to fetch payment sessions",
          type: "error",
        })
      );
    }
  };

  const handleDeleteSponsor = async (id: string) => {
    try {
      await deleteSponsors(id);
      setSponsors((prev) => prev.filter((sponsor) => sponsor._id !== id));
      dispatch(
        showToast({ message: "Sponsor deleted successfully", type: "success" })
      );
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({ message: err.response?.data?.message, type: "error" })
      );
    }
  };

  const handleAddSession = async (newSession: NewSessionData) => {
    try {
      setIsSubmitting(true);

      if (!newSession.name.trim()) {
        dispatch(
          showToast({ message: "Session name is required", type: "error" })
        );
        return;
      }

      if (!newSession.startDate || !newSession.endDate) {
        dispatch(
          showToast({
            message: "Start date and end date are required",
            type: "error",
          })
        );
        return;
      }

      const amount = Number(newSession.amount);
      if (isNaN(amount) || amount <= 0) {
        dispatch(
          showToast({ message: "Amount must be greater than 0", type: "error" })
        );
        return;
      }

      const response = await createPaymentSession({
        sessionName: newSession.name,
        startDate: newSession.startDate,
        endDate: newSession.endDate,
        amount: amount,
      });

      if (response?.status === 201) {
        //@ts-ignore
        const sessionData = response.data.data.session;
        const sessionId = sessionData._id;

        const createdSession: PaymentSessionWithEditing = {
          id: sessionId,
          _id: sessionId,
          sessionName: sessionData.sessionName,
          startDate: sessionData.startDate,
          endDate: sessionData.endDate,
          amount: sessionData.amount,
          isEditing: false,
        };

        dispatch(
          showToast({
            message: "Payment session created successfully",
            type: "success",
          })
        );
        setPaymentSessions((prev) => [...prev, createdSession]);
      }
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({
          message:
            err.response?.data?.message || "Failed to create payment session",
          type: "error",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSession = async (
    sessionId: string,
    updateData: CreatePaymentSessionData
  ) => {
    try {
      setIsSessionUpdating(true);
      const response = await updatePaymentSession(sessionId, updateData);

      if (response?.data?.data) {
        await fetchPaymentSessions();
        dispatch(
          showToast({
            message: "Session updated successfully",
            type: "success",
          })
        );
      }
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({
          message: err.response?.data?.message || "Failed to update session",
          type: "error",
        })
      );
    } finally {
      setIsSessionUpdating(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const response = await deletePaymentSession(sessionId);

      if (response?.status === 204) {
        setPaymentSessions((prev) => prev.filter((s) => s._id !== sessionId));
        setCurrentSession("");
        dispatch(
          showToast({
            message: "Payment session deleted successfully",
            type: "success",
          })
        );
      }
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({
          message:
            err.response?.data?.message || "Failed to delete payment session",
          type: "error",
        })
      );
    }
  };

  useEffect(() => {
    fetchSponsors();
    fetchPaymentSessions();
  }, []);

  return {
    sponsors,
    isLoading,
    error,
    paymentSessions,
    currentSession,
    isSessionUpdating,
    isSubmitting,
    isSavingSettings,
    setCurrentSession,
    handleDeleteSponsor,
    handleAddSession,
    handleUpdateSession,
    handleDeleteSession,
    fetchSponsors,
    fetchPaymentSessions,
    setSponsors,
    setIsSavingSettings,
  };
};
