"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { getSponsors, deleteSponsors } from "@/utils/sponsorController";
import {
  getAllPaymentSessions,
  createPaymentSession,
  updatePaymentSession,
  deletePaymentSession,
} from "@/utils/paymentSessionController";
import type {
  PaymentSession,
  PaymentSessionResponse,
  SinglePaymentSessionResponse,
  CreatePaymentSessionData,
} from "@/utils/paymentSessionController";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showToast } from "@/utils/toastSlice";
import ToastNotification from "../toastNotification/ToastNotification";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Save } from "lucide-react";
import { useDispatch } from "react-redux";

interface SponsorData {
  id?: string;
  name: string;
  paymentSession?: string;
  _id?: string;
  [key: string]: string | undefined;
}

interface ApiResponse {
  data: {
    data: SponsorData[];
  };
}

interface PaymentSessionWithEditing extends PaymentSession {
  isEditing?: boolean;
  _id?: string;
  activeStatus?: boolean;
}

const Sponsors = () => {
  const [sponsors, setSponsors] = useState<SponsorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sponsorData, setSponsorData] = useState<SponsorData>({
    name: "",
  });
  const [paymentSessions, setPaymentSessions] = useState<
    PaymentSessionWithEditing[]
  >([]);
  const [currentSession, setCurrentSession] = useState<string>("");
  const [enableGracePeriod, setEnableGracePeriod] = useState(false);
  const [gracePeriodDays, setGracePeriodDays] = useState("14");
  const [activeTab, setActiveTab] = useState("sponsors");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [newSession, setNewSession] = useState({
    name: "",
    startDate: "",
    endDate: "",
    amount: "",
  });
  const [selectedSession, setSelectedSession] =
    useState<PaymentSessionWithEditing | null>(null);
  const dispatch = useDispatch();

  const fetchPaymentSessions = async () => {
    try {
      const response = await getAllPaymentSessions();
      console.log("this is the response", response);
      if (response?.data?.data) {
        //@ts-ignore
        const sessions = response.data.data.sessions.map(
          (session: PaymentSession) => ({
            ...session,
            //@ts-ignore
            _id: session._id,
            isEditing: false,
          })
        );
        setPaymentSessions(sessions);
        // Set the current session to the one with activeStatus true, or null if none
        const activeSession = sessions.find(
          (session: PaymentSessionWithEditing) => session.activeStatus === true
        );

        // console.log("this is the active session", activeSession);
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
  console.log("this is current session", currentSession);
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

  const handleCreateOrUpdateSponsor = () => {
    if (!sponsorData.name.trim()) {
      alert("Sponsor name is required");
      return;
    }

    if (isEditing && sponsorData.id) {
      // Update existing sponsor
      setSponsors((prev) =>
        prev.map((sponsor) =>
          sponsor._id === sponsorData.id
            ? {
                ...sponsor,
                name: sponsorData.name,
                paymentSession: currentSession,
              }
            : sponsor
        )
      );
      alert("Sponsor updated successfully!");
    } else {
      // Create new sponsor
      const newSponsor = {
        _id: Date.now().toString(),
        name: sponsorData.name,
        paymentSession: currentSession,
      };
      setSponsors((prev) => [...prev, newSponsor]);
      alert("Sponsor created successfully!");
    }
    resetForm();
  };

  const handleEdit = (id: string) => {
    const sponsor = sponsors.find((s) => s._id === id);
    if (sponsor) {
      setSponsorData({
        name: sponsor.name,
        id: sponsor._id,
        paymentSession: sponsor.paymentSession,
      });
      setIsEditing(true);
      setActiveTab("sponsors");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSponsors(id);
      setSponsors((prev) => prev.filter((sponsor) => sponsor._id !== id));
      dispatch(
        // @ts-ignore
        showToast({ message: response.data.message, type: "success" })
      );
      // alert("Sponsor deleted successfully");
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({ message: err.response?.data?.message, type: "error" })
      );
    }
  };

  const resetForm = () => {
    setSponsorData({ name: "" });
    setIsEditing(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSponsorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSession = async () => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!newSession.name.trim()) {
        dispatch(
          showToast({
            message: "Session name is required",
            type: "error",
          })
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
          showToast({
            message: "Amount must be greater than 0",
            type: "error",
          })
        );
        return;
      }

      const response = await createPaymentSession({
        sessionName: newSession.name,
        startDate: newSession.startDate,
        endDate: newSession.endDate,
        amount: amount,
      });
      console.log("this is the response", response);
      if (response?.status === 201) {
        //@ts-ignore
        const sessionData = response.data.data.session;
        console.log("this is the session data", sessionData);
        const createdSession: PaymentSessionWithEditing = {
          id: sessionData._id,
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
        setNewSession({
          name: "",
          startDate: "",
          endDate: "",
          amount: "",
        });
      }
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      console.log("this is the error", err);
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and empty string
    if (value === "" || /^\d+$/.test(value)) {
      setNewSession((prev) => ({
        ...prev,
        amount: value,
      }));
    }
  };

  const handleSessionChange = (
    field: keyof PaymentSession,
    value: string | number
  ) => {
    if (!selectedSession) return;

    const updatedSession = { ...selectedSession };

    if (field === "amount") {
      const amount = Number(value);
      if (isNaN(amount) || amount <= 0) {
        dispatch(
          showToast({
            message: "Amount must be greater than 0",
            type: "error",
          })
        );
        return;
      }
      updatedSession.amount = amount;
    } else {
      updatedSession[field] = value as string;
    }

    setSelectedSession(updatedSession);
  };

  const getSessionName = (id: string | undefined) => {
    if (!id) return "Not assigned";
    const session = paymentSessions.find((s) => s.id === id);
    return session ? session.sessionName : "Unknown Session";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US").format(amount);
  };

  const handleSubmitPaymentSessions = async () => {
    try {
      setIsSubmitting(true);
      // Here you would typically make an API call to save the payment sessions
      // For now, we'll just show a success message
      dispatch(
        showToast({
          message: "Payment sessions updated successfully",
          type: "success",
        })
      );
    } catch (error) {
      dispatch(
        showToast({
          message: "Failed to update payment sessions",
          type: "error",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSession = (sessionId: string) => {
    //@ts-ignore
    const session = paymentSessions.find((s) => s._id === sessionId);
    // console.log("this is the session", paymentSessions);
    if (session) {
      // Format the dates to YYYY-MM-DD for the input fields
      const formattedSession = {
        ...session,
        startDate: new Date(session.startDate).toISOString().split("T")[0],
        endDate: new Date(session.endDate).toISOString().split("T")[0],
      };
      setEditingSessionId(sessionId);
      setSelectedSession(formattedSession);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    // if (
    //   window.confirm("Are you sure you want to delete this payment session?")
    // ) {
    try {
      const response = await deletePaymentSession(sessionId);

      if (response?.status === 204) {
        setPaymentSessions((prev) => prev.filter((s) => s._id !== sessionId));
        setCurrentSession("");
        // Update the local state to remove the deleted session
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

  const handleSaveSession = async () => {
    if (!selectedSession) return;

    try {
      const updateData: CreatePaymentSessionData = {
        sessionName: selectedSession.sessionName,
        startDate: selectedSession.startDate,
        endDate: selectedSession.endDate,
        amount: Number(selectedSession.amount),
      };
      const response = await updatePaymentSession(
        //@ts-ignore
        selectedSession._id,
        updateData
      );
      if (response?.data?.data) {
        setPaymentSessions((prev) =>
          prev.map((s) =>
            //@ts-ignore
            s._id === selectedSession._id ? selectedSession : s
          )
        );
        setEditingSessionId(null);
        setSelectedSession(null);
        dispatch(
          showToast({
            message: "Payment session updated successfully",
            type: "success",
          })
        );
      }
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({
          message:
            err.response?.data?.message || "Failed to update payment session",
          type: "error",
        })
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingSessionId(null);
    setSelectedSession(null);
  };

  const handleCurrentSessionChange = async (sessionId: string) => {
    console.log("this is the session id", sessionId);
    try {
      // Find the session to activate
      const sessionToActivate = paymentSessions.find(
        (session) => session._id === sessionId
      );

      console.log("this is the session to activate", sessionToActivate);
      if (!sessionToActivate) return;

      // Update the session to active
      const updateData: CreatePaymentSessionData = {
        sessionName: sessionToActivate.sessionName,
        startDate: sessionToActivate.startDate,
        endDate: sessionToActivate.endDate,
        amount: Number(sessionToActivate.amount),
        activeStatus: true,
      };

      // First, set the current session immediately for better UX
      setCurrentSession(sessionId);

      const response = await updatePaymentSession(
        //@ts-ignore
        sessionToActivate._id,
        updateData
      );

      if (response?.data?.data) {
        // Fetch the latest sessions to ensure we have the correct active status
        await fetchPaymentSessions();

        dispatch(
          showToast({
            message: "Active session updated successfully",
            type: "success",
          })
        );
      }
    } catch (error) {
      // Revert the current session if there's an error
      setCurrentSession("");
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({
          message:
            err.response?.data?.message || "Failed to update active session",
          type: "error",
        })
      );
    }
  };

  useEffect(() => {
    fetchSponsors();
    fetchPaymentSessions();
  }, []);

  console.log("this is the current session", currentSession);

  return (
    <div className='min-h-screen'>
      <div className='p-6 space-y-6'>
        <div className='flex justify-between items-center bg-gradient-to-r from-blue-700 via-slate-800 to-slate-900 text-white p-6 rounded-lg shadow-lg'>
          <h1 className='text-3xl font-bold tracking-tight'>
            Sponsors Management
          </h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2 bg-gray-100'>
            <TabsTrigger
              value='sponsors'
              className='data-[state=active]:bg-white data-[state=active]:text-gray-800'
            >
              Sponsors
            </TabsTrigger>
            <TabsTrigger
              value='settings'
              className='data-[state=active]:bg-white data-[state=active]:text-gray-800'
            >
              Payment Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value='sponsors' className='space-y-6 mt-6'>
            <Card className='border-gray-200 shadow-sm'>
              <CardHeader className='bg-gradient-to-r from-gray-100 to-white text-gray-800 rounded-t-lg border-b'>
                <CardTitle>
                  {isEditing ? "Edit Sponsor" : "Add New Sponsor"}
                </CardTitle>
                <CardDescription className='text-gray-600'>
                  {isEditing
                    ? "Update the sponsor information below"
                    : "Enter the details to add a new sponsor"}
                </CardDescription>
              </CardHeader>
              <CardContent className='pt-6'>
                <div className='grid gap-4'>
                  <div className='grid grid-cols-1 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='name' className='text-gray-700'>
                        Sponsor Name
                      </Label>
                      <Input
                        id='name'
                        name='name'
                        value={sponsorData.name}
                        onChange={handleInputChange}
                        placeholder='Enter sponsor name'
                        className='border-gray-300 focus:border-gray-400'
                      />
                    </div>
                  </div>
                  <div className='flex justify-end space-x-2'>
                    {isEditing && (
                      <Button
                        variant='outline'
                        onClick={resetForm}
                        className='border-gray-300 text-gray-700 hover:bg-gray-100'
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      onClick={handleCreateOrUpdateSponsor}
                      className='bg-gray-200 hover:bg-gray-300 text-gray-800'
                    >
                      {isEditing ? (
                        <>
                          <Save className='mr-2 h-4 w-4' />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Plus className='mr-2 h-4 w-4' />
                          Add Sponsor
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='border-gray-200 shadow-sm'>
              <CardHeader className='bg-gradient-to-r from-gray-100 to-white text-gray-800 rounded-t-lg border-b'>
                <CardTitle>Sponsors List</CardTitle>
                <CardDescription className='text-gray-600'>
                  Manage your sponsors and their associated information
                </CardDescription>
              </CardHeader>
              <CardContent className='pt-6'>
                <div className='rounded-md border'>
                  <div className='relative w-full'>
                    <Table>
                      <TableHeader className='bg-blue-100/70'>
                        <TableRow className='hover:bg-blue-100/70'>
                          <TableHead className='text-gray-700 text-sm sm:text-base text-left w-[40%]'>
                            Name
                          </TableHead>
                          <TableHead className='text-gray-700 text-sm sm:text-base text-center w-[30%]'>
                            Payment Session
                          </TableHead>
                          <TableHead className='text-gray-700 text-sm sm:text-base text-center w-[20%]'>
                            Usage
                          </TableHead>
                          <TableHead className='text-gray-700 w-[10%] text-sm sm:text-base text-center'>
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                    </Table>
                    <div className='h-[180px] sm:h-[200px] md:h-[220px] lg:h-[142px] overflow-auto'>
                      <Table>
                        <TableBody>
                          {isLoading ? (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className='text-center py-4 sm:py-6 text-gray-500 text-sm sm:text-base'
                              >
                                Loading sponsors...
                              </TableCell>
                            </TableRow>
                          ) : error ? (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className='text-center py-4 sm:py-6 text-red-500 text-sm sm:text-base'
                              >
                                {error}
                              </TableCell>
                            </TableRow>
                          ) : sponsors.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className='text-center py-4 sm:py-6 text-gray-500 text-sm sm:text-base'
                              >
                                No sponsors found. Add your first sponsor above.
                              </TableCell>
                            </TableRow>
                          ) : (
                            sponsors.map((sponsor, index) => (
                              <TableRow
                                key={sponsor._id}
                                className={
                                  index % 2 === 0
                                    ? "bg-white"
                                    : "bg-blue-100/50"
                                }
                              >
                                <TableCell className='font-medium text-sm sm:text-base text-left w-[40%]'>
                                  <div className='flex items-center gap-2'>
                                    <div className='w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-blue-300 to-blue-400'></div>
                                    {sponsor.name}
                                  </div>
                                </TableCell>
                                <TableCell className='text-sm sm:text-base text-center w-[30%]'>
                                  <div className='flex justify-center'>
                                    <Badge
                                      variant='outline'
                                      className='bg-blue-100/70 text-gray-700 border-blue-300 text-xs sm:text-sm'
                                    >
                                      {getSessionName(sponsor.paymentSession)}
                                    </Badge>
                                  </div>
                                </TableCell>
                                <TableCell className='text-sm sm:text-base text-center w-[20%]'>
                                  <div className='flex justify-center'>
                                    <Badge className='bg-blue-200/70 hover:bg-blue-300/70 text-gray-800 text-xs sm:text-sm'>
                                      20%
                                    </Badge>
                                  </div>
                                </TableCell>
                                <TableCell className='text-center w-[10%]'>
                                  <div className='flex justify-center space-x-1 sm:space-x-2'>
                                    <Button
                                      variant='outline'
                                      size='icon'
                                      onClick={() => handleEdit(sponsor._id!)}
                                      className='border-blue-300 text-gray-700 hover:bg-blue-100/70 h-7 w-7 sm:h-8 sm:w-8'
                                    >
                                      <Pencil className='h-3 w-3 sm:h-4 sm:w-4' />
                                    </Button>
                                    <Button
                                      variant='outline'
                                      size='icon'
                                      onClick={() => handleDelete(sponsor._id!)}
                                      className='border-red-300 text-red-600 hover:bg-red-50 h-7 w-7 sm:h-8 sm:w-8'
                                    >
                                      <Trash2 className='h-3 w-3 sm:h-4 sm:w-4' />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='settings' className='space-y-6 mt-6'>
            <Card className='border-gray-200 shadow-sm'>
              <CardHeader className='bg-gradient-to-r from-gray-100 to-white text-gray-800 rounded-t-lg border-b'>
                <CardTitle>Payment Sessions</CardTitle>
                <CardDescription className='text-gray-600'>
                  Configure university semester payment sessions
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6 pt-6'>
                <div className='space-y-4'>
                  {/* Session Form */}
                  <div className='grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-md bg-gray-50'>
                    <div className='space-y-2'>
                      <Label htmlFor='session-name' className='text-gray-700'>
                        Session Name
                      </Label>
                      <Input
                        id='session-name'
                        value={selectedSession?.sessionName || newSession.name}
                        onChange={(e) =>
                          selectedSession
                            ? handleSessionChange("sessionName", e.target.value)
                            : setNewSession((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                        }
                        placeholder='Enter session name'
                        className='border-gray-300 focus:border-gray-400 bg-white'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='start-date' className='text-gray-700'>
                        Start Date
                      </Label>
                      <Input
                        id='start-date'
                        type='date'
                        value={
                          selectedSession?.startDate || newSession.startDate
                        }
                        onChange={(e) =>
                          selectedSession
                            ? handleSessionChange("startDate", e.target.value)
                            : setNewSession((prev) => ({
                                ...prev,
                                startDate: e.target.value,
                              }))
                        }
                        className='border-gray-300 focus:border-gray-400 bg-white'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='end-date' className='text-gray-700'>
                        End Date
                      </Label>
                      <Input
                        id='end-date'
                        type='date'
                        value={selectedSession?.endDate || newSession.endDate}
                        onChange={(e) =>
                          selectedSession
                            ? handleSessionChange("endDate", e.target.value)
                            : setNewSession((prev) => ({
                                ...prev,
                                endDate: e.target.value,
                              }))
                        }
                        className='border-gray-300 focus:border-gray-400 bg-white'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='amount' className='text-gray-700'>
                        Amount
                      </Label>
                      <div className='relative'>
                        <Input
                          id='amount'
                          type='number'
                          value={selectedSession?.amount || newSession.amount}
                          onChange={(e) =>
                            selectedSession
                              ? handleSessionChange("amount", e.target.value)
                              : setNewSession((prev) => ({
                                  ...prev,
                                  amount: e.target.value,
                                }))
                          }
                          className='border-gray-300 focus:border-gray-400 bg-white pl-8'
                          min='0'
                          step='1000'
                          placeholder='Enter amount'
                        />
                        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-600'>
                          $
                        </span>
                      </div>
                      {/* <p className='text-xs text-gray-600'>
                        {formatCurrency(
                          selectedSession?.amount || newSession.amount
                        )}
                        /=
                      </p> */}
                    </div>
                  </div>

                  <div className='flex justify-end space-x-2 mt-4'>
                    {selectedSession && (
                      <Button
                        variant='outline'
                        onClick={handleCancelEdit}
                        className='border-gray-300 text-gray-700 hover:bg-gray-100'
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      onClick={
                        selectedSession ? handleSaveSession : handleAddSession
                      }
                      className='bg-blue-600 hover:bg-blue-700 text-white'
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className='animate-spin mr-2'>⏳</span>
                          {selectedSession ? "Saving..." : "Creating..."}
                        </>
                      ) : (
                        <>
                          <Save className='mr-2 h-4 w-4' />
                          {selectedSession
                            ? "Save Changes"
                            : "Add Payment Session"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <Separator className='my-6 bg-gray-200' />

                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-semibold text-gray-800'>
                      Active Payment Sessions
                    </h3>
                    <Badge
                      variant='outline'
                      className='bg-green-100 text-green-800 border-green-200'
                    >
                      {paymentSessions.length} Sessions
                    </Badge>
                  </div>
                  <div className='rounded-md border'>
                    <Table>
                      <TableHeader className='bg-gray-50'>
                        <TableRow>
                          <TableHead className='font-medium text-gray-700'>
                            Session Name
                          </TableHead>
                          <TableHead className='font-medium text-gray-700'>
                            Duration
                          </TableHead>
                          <TableHead className='font-medium text-gray-700'>
                            Amount
                          </TableHead>
                          <TableHead className='font-medium text-gray-700'>
                            Status
                          </TableHead>
                          <TableHead className='font-medium text-gray-700 text-right'>
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentSessions.map((session) => {
                          const startDate = new Date(session.startDate);
                          const endDate = new Date(session.endDate);
                          const today = new Date();
                          //@ts-ignore
                          const isActive = session.activeStatus;

                          return (
                            <TableRow
                              key={session.id}
                              className='hover:bg-gray-50'
                            >
                              <TableCell className='font-medium'>
                                {session.sessionName}
                              </TableCell>
                              <TableCell>
                                <div className='flex flex-col'>
                                  <span className='text-sm text-gray-600'>
                                    {startDate.toLocaleDateString()} -{" "}
                                    {endDate.toLocaleDateString()}
                                  </span>
                                  <span className='text-xs text-gray-500'>
                                    {Math.ceil(
                                      (endDate.getTime() -
                                        startDate.getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    )}{" "}
                                    days
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className='flex flex-col'>
                                  <span className='font-medium'>
                                    {formatCurrency(session.amount)}
                                  </span>
                                  {/* <span className='text-xs text-gray-500'>
                                    USD
                                  </span> */}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant='outline'
                                  className={
                                    isActive
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : "bg-blue-100 text-blue-800 border-blue-200"
                                    // : "bg-gray-100 text-gray-800 border-gray-200"
                                  }
                                >
                                  {isActive ? "Active" : "Dormant"}
                                </Badge>
                              </TableCell>
                              <TableCell className='text-right'>
                                <div className='flex justify-end space-x-2'>
                                  <Button
                                    variant='outline'
                                    size='icon'
                                    onClick={() =>
                                      //@ts-ignore
                                      handleEditSession(session._id)
                                    }
                                    className='border-blue-300 text-blue-600 hover:bg-blue-50 h-7 w-7'
                                  >
                                    <Pencil className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    variant='outline'
                                    size='icon'
                                    onClick={() =>
                                      //@ts-ignore
                                      handleDeleteSession(session._id)
                                    }
                                    className='border-red-300 text-red-600 hover:bg-red-50 h-7 w-7'
                                  >
                                    <Trash2 className='h-4 w-4' />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <Separator className='my-6 bg-gray-200' />

                <div className='space-y-6'>
                  <div className='space-y-2 bg-gray-50 p-4 rounded-md border border-gray-200'>
                    <Label htmlFor='current-session' className='text-gray-700'>
                      Current Payment Session
                    </Label>
                    <Select
                      value={currentSession}
                      onValueChange={(value) =>
                        handleCurrentSessionChange(value)
                      }
                    >
                      <SelectTrigger
                        id='current-session'
                        className='border-gray-300 focus:ring-gray-400'
                      >
                        <SelectValue placeholder='Please select a session'>
                          {currentSession ? (
                            <>
                              {
                                paymentSessions.find(
                                  (session) => session._id === currentSession
                                )?.sessionName
                              }
                            </>
                          ) : (
                            "Please select a session"
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className='border-gray-200'>
                        {paymentSessions.map((session) => (
                          <SelectItem
                            key={session._id!}
                            value={session._id!}
                            className={
                              session._id === currentSession
                                ? "bg-green-50"
                                : ""
                            }
                          >
                            {session.sessionName} -{" "}
                            {formatCurrency(session.amount)}/=
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className='text-sm text-gray-600 mt-1'>
                      This is the active payment session for students
                    </p>
                  </div>

                  <Separator className='my-6 bg-gray-200' />

                  <div className='space-y-4 bg-gray-50 p-4 rounded-md border border-gray-200'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <Label
                          htmlFor='grace-period-switch'
                          className='text-gray-700'
                        >
                          Enable Grace Period
                        </Label>
                        <p className='text-sm text-gray-600'>
                          Allow payments to be delayed for a specified period
                        </p>
                      </div>
                      <Switch
                        id='grace-period-switch'
                        checked={enableGracePeriod}
                        onCheckedChange={setEnableGracePeriod}
                        className='data-[state=checked]:bg-gray-300'
                      />
                    </div>

                    {enableGracePeriod && (
                      <div className='space-y-2 pl-4 border-l-2 border-gray-300'>
                        <Label htmlFor='grace-days' className='text-gray-700'>
                          Grace Period (Days)
                        </Label>
                        <Input
                          id='grace-days'
                          type='number'
                          min='1'
                          max='90'
                          value={gracePeriodDays}
                          onChange={(e) => setGracePeriodDays(e.target.value)}
                          className='border-gray-300 focus:border-gray-400 bg-white w-32'
                        />
                      </div>
                    )}
                  </div>

                  <div className='flex justify-end'>
                    <Button
                      className='bg-gray-200 hover:bg-gray-300 text-gray-800'
                      onClick={handleSubmitPaymentSessions}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className='animate-spin mr-2'>⏳</span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className='mr-2 h-4 w-4' />
                          Save Settings
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <ToastNotification />
      </div>
    </div>
  );
};

export default Sponsors;
