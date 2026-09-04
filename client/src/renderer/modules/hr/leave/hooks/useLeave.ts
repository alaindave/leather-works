import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type Leave from "../../../../../common/types/Leave";

/* =========================================================
   QUERY KEYS
========================================================= */

export const leaveKeys = {
  all: ["leaves"] as const,

  lists: () => [...leaveKeys.all, "list"] as const,

  details: () => [...leaveKeys.all, "detail"] as const,

  detail: (_id: string) => [...leaveKeys.details(), _id] as const,

  byEmployee: (employeeId: string) =>
    [...leaveKeys.all, "employee", employeeId] as const,

  ongoing: (date: string) => [...leaveKeys.all, "ongoing", date] as const,

  byMonth: (month: string) => [...leaveKeys.all, "month", month] as const,
};

/* =========================================================
   GET LEAVE BY ID
========================================================= */

export const useLeave = (_id?: string) => {
  return useQuery({
    queryKey: leaveKeys.detail(_id ?? ""),

    queryFn: () => {
      if (!_id) {
        throw new Error("Leave ID is required");
      }

      return window.electron.leave.getLeaveById(_id);
    },

    enabled: Boolean(_id),
  });
};

/* =========================================================
   GET LEAVES BY EMPLOYEE
========================================================= */

export const useEmployeeLeaves = (employeeId?: string) => {
  return useQuery({
    queryKey: leaveKeys.byEmployee(employeeId ?? ""),

    queryFn: () => {
      if (!employeeId) {
        throw new Error("Employee ID is required");
      }

      return window.electron.leave.getLeaveByEmployeeId(employeeId);
    },

    enabled: Boolean(employeeId),
  });
};

/* =========================================================
   GET ONGOING LEAVES
========================================================= */

export const useOngoingLeaves = (date?: string) => {
  return useQuery({
    queryKey: leaveKeys.ongoing(date ?? ""),

    queryFn: () => {
      if (!date) {
        throw new Error("Date is required");
      }

      return window.electron.leave.getOngoingLeaves(date);
    },

    enabled: Boolean(date),
  });
};

/* =========================================================
   GET LEAVES BY MONTH
========================================================= */

export const useLeavesByMonth = (month?: string) => {
  return useQuery({
    queryKey: leaveKeys.byMonth(month ?? ""),

    queryFn: () => {
      if (!month) {
        throw new Error("Month is required");
      }

      return window.electron.leave.getLeaveByMonth(month);
    },

    enabled: Boolean(month),
  });
};

/* =========================================================
   CREATE LEAVE
========================================================= */

export const useCreateLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leave: Partial<Leave>) => window.electron.leave.create(leave),

    onSuccess: (createdLeave) => {
      /*
       * Add the newly created leave directly to the
       * relevant employee cache when possible.
       */

      if (createdLeave?.employeeId) {
        queryClient.invalidateQueries({
          queryKey: leaveKeys.byEmployee(createdLeave.employeeId),
        });
      }

      if (createdLeave?.date) {
        queryClient.invalidateQueries({
          queryKey: leaveKeys.ongoing(createdLeave.date),
        });
      }

      queryClient.invalidateQueries({
        queryKey: [...leaveKeys.all, "month"],
      });

      if (createdLeave?._id) {
        queryClient.setQueryData(
          leaveKeys.detail(createdLeave._id),
          createdLeave
        );
      }
    },
  });
};

/* =========================================================
   UPDATE LEAVE
========================================================= */

export const useUpdateLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ _id, updates }: { _id: string; updates: Partial<Leave> }) =>
      window.electron.leave.update(_id, updates),

    onSuccess: (updatedLeave, variables) => {
      if (!updatedLeave) return;

      /*
       * Update individual leave immediately.
       */

      queryClient.setQueryData(leaveKeys.detail(variables._id), updatedLeave);

      /*
       * Refresh employee leaves.
       */

      if (updatedLeave.employeeId) {
        queryClient.invalidateQueries({
          queryKey: leaveKeys.byEmployee(updatedLeave.employeeId),
        });
      }

      /*
       * Refresh month data.
       */

      queryClient.invalidateQueries({
        queryKey: [...leaveKeys.all, "month"],
      });

      /*
       * Refresh ongoing leaves.
       */

      if (updatedLeave.date) {
        queryClient.invalidateQueries({
          queryKey: leaveKeys.ongoing(updatedLeave.date),
        });
      }
    },
  });
};

/* =========================================================
   CANCEL LEAVE
========================================================= */

export const useCancelLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (_id: string) => window.electron.leave.cancel(_id),

    onSuccess: (cancelledLeave, _id) => {
      /*
       * Update the individual leave immediately.
       */

      if (cancelledLeave) {
        queryClient.setQueryData(leaveKeys.detail(_id), cancelledLeave);

        if (cancelledLeave.employeeId) {
          queryClient.invalidateQueries({
            queryKey: leaveKeys.byEmployee(cancelledLeave.employeeId),
          });
        }

        if (cancelledLeave.date) {
          queryClient.invalidateQueries({
            queryKey: leaveKeys.ongoing(cancelledLeave.date),
          });
        }
      }

      /*
       * Cancellation can change monthly results.
       */

      queryClient.invalidateQueries({
        queryKey: [...leaveKeys.all, "month"],
      });
    },
  });
};

/* =========================================================
   DELETE LEAVE
========================================================= */

export const useDeleteLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (_id: string) => window.electron.leave.delete(_id),

    onSuccess: (_result, _id) => {
      /*
       * Remove the individual cached leave.
       */

      queryClient.removeQueries({
        queryKey: leaveKeys.detail(_id),
      });

      /*
       * Refresh lists that may contain the deleted leave.
       */

      queryClient.invalidateQueries({
        queryKey: leaveKeys.all,
      });
    },
  });
};
