import axiosInstance from "./axioInstance";

export interface PaymentSession {
  id: string;
  sessionName: string;
  startDate: string;
  endDate: string;
  amount: number;
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

export interface PaymentSessionResponse {
  data: {
    data: PaymentSession[];
  };
}

export interface SinglePaymentSessionResponse {
  data: {
    data: PaymentSession;
  };
}

export const createPaymentSession = async (data: CreatePaymentSessionData) => {
  try {
    const response = await axiosInstance.post<SinglePaymentSessionResponse>(
      "/getPass/sessions",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getPaymentSession = async (sessionId: string) => {
  try {
    const response = await axiosInstance.get<SinglePaymentSessionResponse>(
      `/getPass/sessions/${sessionId}`
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllPaymentSessions = async () => {
  try {
    const response = await axiosInstance.get<PaymentSessionResponse>(
      "/getPass/sessions"
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updatePaymentSession = async (
  sessionId: string,
  data: CreatePaymentSessionData
) => {
  try {
    const response = await axiosInstance.patch<SinglePaymentSessionResponse>(
      `/getPass/sessions/${sessionId}`,
      data
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deletePaymentSession = async (sessionId: string) => {
  try {
    const response = await axiosInstance.delete<SinglePaymentSessionResponse>(
      `/getPass/sessions/${sessionId}`
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
