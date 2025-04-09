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
import { Save } from "lucide-react";
import type {
  NewSessionData,
  PaymentSessionWithEditing,
} from "@/types/sponsor.types";

interface PaymentSessionFormProps {
  newSession: NewSessionData;
  selectedSession: PaymentSessionWithEditing | null;
  isSubmitting: boolean;
  onSessionChange: (field: keyof NewSessionData, value: string) => void;
  onSelectedSessionChange: (
    field: keyof PaymentSessionWithEditing,
    value: string | number
  ) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const PaymentSessionForm: React.FC<PaymentSessionFormProps> = ({
  newSession,
  selectedSession,
  isSubmitting,
  onSessionChange,
  onSelectedSessionChange,
  onSubmit,
  onCancel,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US").format(amount);
  };

  return (
    <div className='space-y-4'>
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
                ? onSelectedSessionChange("sessionName", e.target.value)
                : onSessionChange("name", e.target.value)
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
            value={selectedSession?.startDate || newSession.startDate}
            onChange={(e) =>
              selectedSession
                ? onSelectedSessionChange("startDate", e.target.value)
                : onSessionChange("startDate", e.target.value)
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
                ? onSelectedSessionChange("endDate", e.target.value)
                : onSessionChange("endDate", e.target.value)
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
              type='text'
              value={selectedSession?.amount || newSession.amount}
              onChange={(e) =>
                selectedSession
                  ? onSelectedSessionChange("amount", e.target.value)
                  : onSessionChange("amount", e.target.value)
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
        </div>
      </div>

      <div className='flex justify-end space-x-2 mt-4'>
        {selectedSession && (
          <Button
            variant='outline'
            onClick={onCancel}
            className='border-gray-300 text-gray-700 hover:bg-gray-100'
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={onSubmit}
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
              {selectedSession ? "Save Changes" : "Add Payment Session"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
