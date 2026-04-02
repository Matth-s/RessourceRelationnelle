import { useQuery } from "@tanstack/react-query";
import { getUsersApi } from "../api/get-users-api";
import { FETCH_KEYS } from "@/types/fetch-key-type";
import { useEffect, useMemo, useState } from "react";
import type { IStatusParams, IUserRole } from "@/types/user-type";
import { useSearchParams } from "react-router";

export const useUsers = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState(() => {
    const roles = searchParams.get("roles") || undefined;
    const status = searchParams.get("status") as IStatusParams | null;
    const search = searchParams.get("search") || "";

    return {
      rolesParams: roles ? (roles as IUserRole) : undefined,
      statusParams: status ?? undefined,
      search,
    };
  });

  const {
    isPending,
    error,
    data = [],
    refetch,
  } = useQuery({
    queryKey: [FETCH_KEYS.USERS],
    queryFn: getUsersApi,
    retry: false,
  });

  const usersFiltred = useMemo(() => {
    return data.filter((user) => {
      const matchUsername =
        filters.search === "" ||
        user.username.toLowerCase().includes(filters.search.toLowerCase());

      const matchRole =
        filters.rolesParams && user.role.includes(filters.rolesParams);

      const matchStatus =
        filters.statusParams === undefined ||
        (filters.statusParams === "active" && user.isActive) ||
        (filters.statusParams === "inactive" && !user.isActive);

      return matchUsername && matchRole && matchStatus;
    });
  }, [data, filters]);

  useEffect(() => {
    const params: Record<string, string> = {};

    if (filters.statusParams) {
      params.status = filters.statusParams;
    }

    if (filters.search.trim() !== "") {
      params.search = filters.search;
    }

    setSearchParams(params);
  }, [filters, setSearchParams]);

  return {
    isPending,
    error,
    data,
    usersFiltred,
    filters,
    setFilters,
    refetch,
  };
};
