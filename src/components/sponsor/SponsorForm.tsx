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
import { Plus, Save } from "lucide-react";
import type { SponsorData } from "@/types/sponsor.types";

interface SponsorFormProps {
  sponsorData: SponsorData;
  isEditing: boolean;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const SponsorForm: React.FC<SponsorFormProps> = ({
  sponsorData,
  isEditing,
  onInputChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <Card className='border-gray-200 shadow-sm'>
      <CardHeader className='bg-gradient-to-r from-gray-100 to-white text-gray-800 rounded-t-lg border-b'>
        <CardTitle>{isEditing ? "Edit Sponsor" : "Add New Sponsor"}</CardTitle>
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
                onChange={onInputChange}
                placeholder='Enter sponsor name'
                className='border-gray-300 focus:border-gray-400'
              />
            </div>
          </div>
          <div className='flex justify-end space-x-2'>
            {isEditing && (
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
  );
};
