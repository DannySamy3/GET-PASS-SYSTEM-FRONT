export interface SponsorData {
  id?: string;
  name: string;
  paymentSession?: string;
  _id?: string;
  [key: string]: string | undefined;
}

export interface ApiResponse {
  data: {
    data: SponsorData[];
  };
}

export interface PaymentSessionWithEditing extends PaymentSession {
  isEditing?: boolean;
  _id?: string;
  activeStatus?: boolean;
  grace?: boolean;
  graceRemainingDays?: number;
}

export interface NewSessionData {
  name: string;
  startDate: string;
  endDate: string;
  amount: string;
}

export interface PaymentSession {
  id: string;
  sessionName: string;
  startDate: string;
  endDate: string;
  amount: number;
  activeStatus?: boolean;
  grace?: boolean;
  graceRemainingDays?: number;
}

export interface CreatePaymentSessionData {
  sessionName: string;
  startDate: string;
  endDate: string;
  amount: number;
  activeStatus?: boolean;
  grace?: boolean;
  gracePeriodDays?: number;
}
