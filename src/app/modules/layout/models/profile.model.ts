export interface ProfileResponse {
  status: {
    code: number;
    message: string;
  };
  data: {
    accountId: string;
    email: string;
    isActive: boolean;
    userId: string;
    name: string;
    phone: string;
    signatureUrl: string;
  };
}

export interface ProfileRequest {
  email: string,
  name: string,
  phone: string
}
