import React from "react";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaymentSessionWithEditing } from "@/types/sponsor.types";

interface PaymentSettingsProps {
  paymentSessions: PaymentSessionWithEditing[];
  currentSession: string;
  enableGracePeriod: boolean;
  gracePeriodDays: string;
  isSessionUpdating: boolean;
  isSavingSettings: boolean;
  onCurrentSessionChange: (sessionId: string) => void;
  onGracePeriodChange: (checked: boolean) => void;
  onGracePeriodDaysChange: (value: string) => void;
  onSaveSettings: () => void;
}

export const PaymentSettings: React.FC<PaymentSettingsProps> = ({
  paymentSessions,
  currentSession,
  enableGracePeriod,
  gracePeriodDays,
  isSessionUpdating,
  isSavingSettings,
  onCurrentSessionChange,
  onGracePeriodChange,
  onGracePeriodDaysChange,
  onSaveSettings,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US").format(amount);
  };

  return (
    <div className='space-y-6'>
      <div className='space-y-2 bg-gray-50 p-4 rounded-md border border-gray-200'>
        <Label htmlFor='current-session' className='text-gray-700'>
          Current Payment Session
        </Label>
        <Select
          value={currentSession}
          onValueChange={onCurrentSessionChange}
          disabled={isSessionUpdating}
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
                className={session._id === currentSession ? "bg-green-50" : ""}
              >
                {session.sessionName} - {formatCurrency(session.amount)}/=
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
            <Label htmlFor='grace-period-switch' className='text-gray-700'>
              Enable Grace Period
            </Label>
            <p className='text-sm text-gray-600'>
              Allow payments to be delayed for a specified period
            </p>
          </div>
          <Switch
            id='grace-period-switch'
            checked={enableGracePeriod}
            onCheckedChange={onGracePeriodChange}
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
              onChange={(e) => onGracePeriodDaysChange(e.target.value)}
              className='border-gray-300 focus:border-gray-400 bg-white w-32'
            />
          </div>
        )}
      </div>

      <div className='flex justify-end'>
        <Button
          className='bg-gray-200 hover:bg-gray-300 text-gray-800'
          onClick={onSaveSettings}
          disabled={isSavingSettings}
        >
          {isSavingSettings ? (
            <>
              <span className=' text-gray-500'>Saving</span>

              <span className='animate-spin ml-2'>⏳</span>
            </>
          ) : (
            // <div className='flex items-center gap-2'>
            //   {/* <div className='animate-spin rounded-full h-4 w-4 border-2 border-gray-800 border-t-transparent'></div> */}
            //   <span className='animate-spin mr-2'>⏳</span>
            // </div>
            <>
              <Save className='mr-2 h-4 w-4' />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
