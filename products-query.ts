import { queryOptions } from '@tanstack/react-query';
import { listProducts } from './products.functions';
export const productsQuery = queryOptions({ queryKey: ['products'], queryFn: () => listProducts(), staleTime: 30000, refetchInterval: 60000 });