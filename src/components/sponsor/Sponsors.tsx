"use client";

import type React from "react";
import { useEffect, useState } from "react";
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

interface SponsorData {
  id?: string;
  name: string;
  paymentSession?: string;
  _id?: string;
  [key: string]: string | undefined;
}

interface PaymentSession {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  amount: string; // Added amount field
}

const Sponsors = () => {
  const [sponsors, setSponsors] = useState<SponsorData[]>([
    { _id: "1", name: "Example Sponsor 1", paymentSession: "1" },
    { _id: "2", name: "Example Sponsor 2", paymentSession: "2" },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [sponsorData, setSponsorData] = useState<SponsorData>({
    name: "",
  });
  const [paymentSessions, setPaymentSessions] = useState<PaymentSession[]>([
    {
      id: "1",
      name: "First Semester 2024/2025",
      startDate: "2024-09-01",
      endDate: "2024-12-15",
      amount: "50000", // Added amount
    },
    {
      id: "2",
      name: "Second Semester 2024/2025",
      startDate: "2025-01-15",
      endDate: "2025-05-30",
      amount: "45000", // Added amount
    },
  ]);
  const [currentSession, setCurrentSession] = useState<string>("1");
  const [enableGracePeriod, setEnableGracePeriod] = useState(false);
  const [gracePeriodDays, setGracePeriodDays] = useState("14");
  const [activeTab, setActiveTab] = useState("sponsors");

  // Simplified mock functions for demonstration
  const fetchSponsors = () => {
    // In a real app, this would be an API call
    console.log("Fetching sponsors...");
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

  const handleDelete = (id: string) => {
    setSponsors((prev) => prev.filter((sponsor) => sponsor._id !== id));
    alert("Sponsor deleted successfully");
  };

  const resetForm = () => {
    setSponsorData({ name: "" });
    setIsEditing(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSponsorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSession = () => {
    const newSession = {
      id: (paymentSessions.length + 1).toString(),
      name: `New Session ${paymentSessions.length + 1}`,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 4))
        .toISOString()
        .split("T")[0],
      amount: "0", // Default amount
    };

    setPaymentSessions([...paymentSessions, newSession]);
  };

  const handleSessionChange = (index: number, field: string, value: string) => {
    const updatedSessions = [...paymentSessions];
    updatedSessions[index] = {
      ...updatedSessions[index],
      [field]: value,
    };
    setPaymentSessions(updatedSessions);
  };

  const getSessionName = (id: string | undefined) => {
    if (!id) return "Not assigned";
    const session = paymentSessions.find((s) => s.id === id);
    return session ? session.name : "Unknown Session";
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US").format(Number(amount));
  };

  useEffect(() => {
    // Simplified for demo purposes
    fetchSponsors();
  }, []);

  return (
    <div className=' min-h-screen'>
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
                    <div className='h-[180px] sm:h-[200px] md:h-[220px] lg:h-[162px] overflow-auto'>
                      <Table>
                        <TableBody>
                          {sponsors.length === 0 ? (
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
                  {paymentSessions.map((session, index) => (
                    <div
                      key={session.id}
                      className='grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-md bg-gray-50'
                    >
                      <div className='space-y-2'>
                        <Label
                          htmlFor={`session-name-${index}`}
                          className='text-gray-700'
                        >
                          Session Name
                        </Label>
                        <Input
                          id={`session-name-${index}`}
                          value={session.name}
                          onChange={(e) =>
                            handleSessionChange(index, "name", e.target.value)
                          }
                          className='border-gray-300 focus:border-gray-400 bg-white'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor={`start-date-${index}`}
                          className='text-gray-700'
                        >
                          Start Date
                        </Label>
                        <Input
                          id={`start-date-${index}`}
                          type='date'
                          value={session.startDate}
                          onChange={(e) =>
                            handleSessionChange(
                              index,
                              "startDate",
                              e.target.value
                            )
                          }
                          className='border-gray-300 focus:border-gray-400 bg-white'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor={`end-date-${index}`}
                          className='text-gray-700'
                        >
                          End Date
                        </Label>
                        <Input
                          id={`end-date-${index}`}
                          type='date'
                          value={session.endDate}
                          onChange={(e) =>
                            handleSessionChange(
                              index,
                              "endDate",
                              e.target.value
                            )
                          }
                          className='border-gray-300 focus:border-gray-400 bg-white'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor={`amount-${index}`}
                          className='text-gray-700'
                        >
                          Amount
                        </Label>
                        <div className='relative'>
                          <Input
                            id={`amount-${index}`}
                            type='number'
                            value={session.amount}
                            onChange={(e) =>
                              handleSessionChange(
                                index,
                                "amount",
                                e.target.value
                              )
                            }
                            className='border-gray-300 focus:border-gray-400 bg-white pl-8'
                            min='0'
                            step='1000'
                          />
                          <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-600'>
                            $
                          </span>
                        </div>
                        <p className='text-xs text-gray-600'>
                          {formatCurrency(session.amount)}/=
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant='outline'
                    onClick={handleAddSession}
                    className='border-gray-300 text-gray-700 hover:bg-gray-100'
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    Add Payment Session
                  </Button>
                </div>

                <Separator className='my-6 bg-gray-200' />

                <div className='space-y-6'>
                  <div className='space-y-2 bg-gray-50 p-4 rounded-md border border-gray-200'>
                    <Label htmlFor='current-session' className='text-gray-700'>
                      Current Payment Session
                    </Label>
                    <Select
                      value={currentSession}
                      onValueChange={setCurrentSession}
                    >
                      <SelectTrigger
                        id='current-session'
                        className='border-gray-300 focus:ring-gray-400'
                      >
                        <SelectValue placeholder='Select current session' />
                      </SelectTrigger>
                      <SelectContent className='border-gray-200'>
                        {paymentSessions.map((session) => (
                          <SelectItem key={session.id} value={session.id}>
                            {session.name} - {formatCurrency(session.amount)}/=
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className='text-sm text-gray-600 mt-1'>
                      This is the active payment session for new sponsors
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
                    <Button className='bg-gray-200 hover:bg-gray-300 text-gray-800'>
                      <Save className='mr-2 h-4 w-4' />
                      Save Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Sponsors;
