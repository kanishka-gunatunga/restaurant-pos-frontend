import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as productService from "@/services/productService";
import { CreateProductPayload, UpdateProductPayload } from "@/types/product";

export const PRODUCT_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCT_KEYS.all, "list"] as const,
  list: (filters: any) => [...PRODUCT_KEYS.lists(), { filters }] as const,
  details: () => [...PRODUCT_KEYS.all, "detail"] as const,
  detail: (id: number) => [...PRODUCT_KEYS.details(), id] as const,
  byCategory: (categoryId: number) => [...PRODUCT_KEYS.lists(), "category", categoryId] as const,
  search: (query: string) => [...PRODUCT_KEYS.all, "search", query] as const,
};

export const useGetAllProducts = (params: { categoryId?: number; subCategoryId?: number; status?: string } = {}) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(params),
    queryFn: () => productService.getAllProducts(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchProducts = (query: string, status?: string) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.search(query),
    queryFn: () => productService.searchProducts(query, status),
    enabled: !!query,
  });
};

export const useGetProductById = (id: number) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, imageFile }: { data: CreateProductPayload; imageFile?: File }) =>
      productService.createProduct(data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, imageFile }: { id: number; data: UpdateProductPayload; imageFile?: File }) =>
      productService.updateProduct(id, data, imageFile),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(variables.id) });
    },
  });
};

export const useActivateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productService.activateProduct(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(id) });
    },
  });
};

export const useDeactivateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productService.deactivateProduct(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(id) });
    },
  });
};

export const useGetProductsByCategory = (categoryId: number, status?: string) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.byCategory(categoryId),
    queryFn: () => productService.getProductsByCategory(categoryId, status),
    enabled: !!categoryId,
  });
};

export const useGetProductsByBranch = (
  branchId: number,
  params: { categoryId?: number; subCategoryId?: number; status?: string } = {}
) => {
  return useQuery({
    queryKey: [...PRODUCT_KEYS.all, "byBranch", branchId, params],
    queryFn: () => productService.getProductsByBranch(branchId, params),
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000,
  });
};
