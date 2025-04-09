"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ToastNotification from "../toastNotification/ToastNotification";
import { useSponsors } from "@/hooks/useSponsors";
import { SponsorForm } from "./SponsorForm";
import { PaymentSessionForm } from "./PaymentSessionForm";
import { PaymentSettings } from "./PaymentSettings";
import type {
  SponsorData,
  NewSessionData,
  PaymentSessionWithEditing,
} from "@/types/sponsor.types";

const Sponsors = () => {
  const [activeTab, setActiveTab] = useState("sponsors");
  const [isEditing, setIsEditing] = useState(false);
  const [sponsorData, setSponsorData] = useState<SponsorData>({ name: "" });
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] =
    useState<PaymentSessionWithEditing | null>(null);
  const [newSession, setNewSession] = useState<NewSessionData>({
    name: "",
    startDate: "",
    endDate: "",
    amount: "",
  });
  const [enableGracePeriod, setEnableGracePeriod] = useState(false);
  const [gracePeriodDays, setGracePeriodDays] = useState("14");

  const {
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
    setSponsors,
    setIsSavingSettings,
  } = useSponsors();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSponsorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdateSponsor = () => {
    if (!sponsorData.name.trim()) {
      alert("Sponsor name is required");
      return;
    }

    if (isEditing && sponsorData.id) {
      // Update existing sponsor
      setSponsors((prev: SponsorData[]) =>
        prev.map((sponsor: SponsorData) =>
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
      const newSponsor: SponsorData = {
        _id: Date.now().toString(),
        name: sponsorData.name,
        paymentSession: currentSession,
      };
      setSponsors((prev: SponsorData[]) => [...prev, newSponsor]);
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

  const resetForm = () => {
    setSponsorData({ name: "" });
    setIsEditing(false);
  };

  const handleSessionChange = (field: keyof NewSessionData, value: string) => {
    setNewSession((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectedSessionChange = (
    field: keyof PaymentSessionWithEditing,
    value: string | number
  ) => {
    if (!selectedSession) return;
    setSelectedSession((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  const handleEditSession = (sessionId: string) => {
    const session = paymentSessions.find((s) => s._id === sessionId);
    if (session) {
      const formattedSession = {
        ...session,
        startDate: new Date(session.startDate).toISOString().split("T")[0],
        endDate: new Date(session.endDate).toISOString().split("T")[0],
      };
      setEditingSessionId(sessionId);
      setSelectedSession(formattedSession);
    }
  };

  const handleCancelEdit = () => {
    setEditingSessionId(null);
    setSelectedSession(null);
  };

  const handleSaveSession = async () => {
    if (!selectedSession) return;

    try {
      const updateData = {
        sessionName: selectedSession.sessionName,
        startDate: selectedSession.startDate,
        endDate: selectedSession.endDate,
        amount: Number(selectedSession.amount),
      };
      await handleUpdateSession(selectedSession._id!, updateData);
      setEditingSessionId(null);
      setSelectedSession(null);
    } catch (error) {
      console.error("Failed to update session:", error);
    }
  };

  const handleCurrentSessionChange = async (sessionId: string) => {
    try {
      const sessionToActivate = paymentSessions.find(
        (session) => session._id === sessionId || session.id === sessionId
      );

      if (!sessionToActivate) {
        return;
      }

      const updateData = {
        sessionName: sessionToActivate.sessionName,
        startDate: sessionToActivate.startDate,
        endDate: sessionToActivate.endDate,
        amount: Number(sessionToActivate.amount),
        activeStatus: true,
      };

      setCurrentSession(sessionId);
      const sessionIdToUse = sessionToActivate._id || sessionToActivate.id;
      await handleUpdateSession(sessionIdToUse, updateData);
    } catch (error) {
      setCurrentSession("");
      console.error("Failed to update active session:", error);
    }
  };

  const handleGracePeriodChange = (checked: boolean) => {
    setEnableGracePeriod(checked);
  };

  const handleGracePeriodDaysChange = (value: string) => {
    setGracePeriodDays(value);
  };

  const handleSubmitPaymentSessions = async () => {
    try {
      if (!currentSession) {
        return;
      }

      const currentSessionData = paymentSessions.find(
        (session) => session._id === currentSession
      );

      if (!currentSessionData) {
        return;
      }

      setIsSavingSettings(true);
      const updateData = {
        sessionName: currentSessionData.sessionName,
        startDate: currentSessionData.startDate,
        endDate: currentSessionData.endDate,
        amount: currentSessionData.amount,
        grace: enableGracePeriod,
        gracePeriodDays: enableGracePeriod
          ? Number(gracePeriodDays)
          : undefined,
      };

      await handleUpdateSession(currentSession, updateData);
      setIsSavingSettings(false);
    } catch (error) {
      console.error("Failed to update payment settings:", error);
    }
  };

  const getSessionName = (id: string | undefined) => {
    if (!id) return "Not assigned";
    const session = paymentSessions.find((s) => s.id === id);
    return session ? session.sessionName : "Unknown Session";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US").format(amount);
  };

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
            <SponsorForm
              sponsorData={sponsorData}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onSubmit={handleCreateOrUpdateSponsor}
              onCancel={resetForm}
            />

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
                                      onClick={() =>
                                        handleDeleteSponsor(sponsor._id!)
                                      }
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
                <PaymentSessionForm
                  newSession={newSession}
                  selectedSession={selectedSession}
                  isSubmitting={isSubmitting}
                  onSessionChange={handleSessionChange}
                  onSelectedSessionChange={handleSelectedSessionChange}
                  onSubmit={
                    selectedSession
                      ? handleSaveSession
                      : () => handleAddSession(newSession)
                  }
                  onCancel={handleCancelEdit}
                />

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
                            Activity
                          </TableHead>
                          <TableHead className='font-medium text-gray-700'>
                            Grace Status
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
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant='outline'
                                  className={
                                    isActive
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : "bg-blue-100 text-blue-800 border-blue-200"
                                  }
                                >
                                  {isActive ? "Active" : "Dormant"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant='outline'
                                  className={
                                    session.grace
                                      ? "bg-yellow-100 text-yellow-800 border-yellow-200 min-w-[100px]"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                  }
                                >
                                  {session.grace ? (
                                    <div className='flex items-center gap-2'>
                                      <span>Activated</span>
                                      <span className='text-xs'>
                                        ({session.graceRemainingDays} days)
                                      </span>
                                    </div>
                                  ) : (
                                    "Deactivated"
                                  )}
                                </Badge>
                              </TableCell>
                              <TableCell className='text-right'>
                                <div className='flex justify-end space-x-2'>
                                  <Button
                                    variant='outline'
                                    size='icon'
                                    onClick={() =>
                                      handleEditSession(session._id!)
                                    }
                                    className='border-blue-300 text-blue-600 hover:bg-blue-50 h-7 w-7'
                                  >
                                    <Pencil className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    variant='outline'
                                    size='icon'
                                    onClick={() =>
                                      handleDeleteSession(session._id!)
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

                <PaymentSettings
                  paymentSessions={paymentSessions}
                  currentSession={currentSession}
                  enableGracePeriod={enableGracePeriod}
                  gracePeriodDays={gracePeriodDays}
                  isSessionUpdating={isSessionUpdating}
                  isSavingSettings={isSavingSettings}
                  onCurrentSessionChange={handleCurrentSessionChange}
                  onGracePeriodChange={handleGracePeriodChange}
                  onGracePeriodDaysChange={handleGracePeriodDaysChange}
                  onSaveSettings={handleSubmitPaymentSessions}
                />
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
