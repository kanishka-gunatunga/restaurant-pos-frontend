export interface Branch {
  id: string | number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBranchData extends Omit<Branch, "id" | "createdAt" | "updatedAt"> {}
export interface UpdateBranchData extends Partial<CreateBranchData> {}
