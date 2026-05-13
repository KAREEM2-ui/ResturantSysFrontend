import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { clientsService } from "../services/clients.service";

const PAGE_SIZE = 10;

function normalizeClient(client) {
  const points = Number(client?.points) || 0;

  return {
    ...client,
    id: client?._id,
    name: client?.phone || "Unknown Client",
    visits: points,
    tier: points >= 100 ? "VIP" : "Regular",
    spend: `OMR ${points.toFixed(0)}`,
    favoritesSummary: `${points} loyalty points`,
  };
}

export function useClientsViewModel(page = 1) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["clients", page],
    queryFn: () => clientsService.getClients({ page }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: "always",
  });

  const clients = useMemo(() => {
    const rawClients = data?.data?.clients || data?.data?.loyaltyClients || [];
    return rawClients.map(normalizeClient);
  }, [data]);

  return {
    clients,
    totalCount: data?.totalCount || 0,
    pageSize: PAGE_SIZE,
    isLoading,
    isError,
    error,
  };
}
