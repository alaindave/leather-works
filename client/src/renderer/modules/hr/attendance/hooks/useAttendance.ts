import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  AttendanceWithEmployee,
  CreateAttendanceDto,
} from "../../../../../common/types/Attendance";

/* =========================================================
   QUERY KEYS
========================================================= */

export const attendanceKeys = {
  all: ["attendance"] as const,

  lists: () => [...attendanceKeys.all, "list"] as const,

  list: () => [...attendanceKeys.lists()] as const,

  details: () => [...attendanceKeys.all, "detail"] as const,

  detail: (_id: string) => [...attendanceKeys.details(), _id] as const,

  byEmployee: (employeeId: string) =>
    [...attendanceKeys.all, "employee", employeeId] as const,

  byDate: (date: string) => [...attendanceKeys.all, "date", date] as const,

  record: (employeeId: string, date: string) =>
    [...attendanceKeys.all, "record", employeeId, date] as const,

  employeesWithoutAttendance: (date: string) =>
    [...attendanceKeys.all, "without-attendance", date] as const,
};

/* =========================================================
   QUERIES
========================================================= */

/**
 * Get all attendance records
 */
export const useAttendance = () => {
  return useQuery({
    queryKey: attendanceKeys.list(),

    queryFn: () => window.electron.attendance.getAll(),
  });
};

/**
 * Get attendance record by ID
 */
export const useAttendanceById = (_id?: string) => {
  return useQuery({
    queryKey: attendanceKeys.detail(_id ?? ""),

    queryFn: () => window.electron.attendance.getById(_id!),

    enabled: !!_id,
  });
};

/**
 * Get attendance records for an employee
 */
export const useEmployeeAttendance = (employeeId?: string) => {
  return useQuery({
    queryKey: attendanceKeys.byEmployee(employeeId ?? ""),

    queryFn: () => window.electron.attendance.getByEmployee(employeeId!),

    enabled: !!employeeId,
  });
};

/**
 * Get employees without attendance for a specific date
 */
export const useEmployeesWithoutAttendance = (date?: string) => {
  return useQuery({
    queryKey: attendanceKeys.employeesWithoutAttendance(date ?? ""),

    queryFn: () =>
      window.electron.attendance.getEmployeesWithoutAttendance(date!),

    enabled: !!date,
  });
};

/**
 * Get attendance records for a specific date
 */
export const useAttendanceByDate = (date?: string) => {
  return useQuery({
    queryKey: attendanceKeys.byDate(date ?? ""),

    queryFn: () => window.electron.attendance.getByDate(date!),

    enabled: !!date,
  });
};

/**
 * Get a specific employee's attendance record for a date
 */
export const useAttendanceRecord = (employeeId?: string, date?: string) => {
  return useQuery({
    queryKey: attendanceKeys.record(employeeId ?? "", date ?? ""),

    queryFn: () =>
      window.electron.attendance.getAttendanceRecord(employeeId!, date!),

    enabled: !!employeeId && !!date,
  });
};

/* =========================================================
   MUTATIONS
========================================================= */

/**
 * Create normal attendance
 */
export const useCreateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAttendanceDto) =>
      window.electron.attendance.create(input),

    onSuccess: (createdAttendance, input) => {
      /*
       * Immediately update the individual employee/date cache.
       */
      if (input.employeeId && input.date) {
        queryClient.setQueryData(
          attendanceKeys.record(input.employeeId, input.date),
          createdAttendance
        );
      }

      /*
       * Refresh all attendance lists in the background.
       */
      queryClient.invalidateQueries({
        queryKey: attendanceKeys.all,
      });
    },
  });
};

/**
 * Create ABSENT / CONGÉ attendance
 */
export const useCreateAbsenceLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      status,
      date,
    }: {
      employeeId: string;
      status: "CONGÉ" | "ABSENT";
      date: string;
    }) =>
      window.electron.attendance.createAbsenceLeave(employeeId, status, date),

    onSuccess: (createdAttendance, variables) => {
      /*
       * Immediately update the employee/date record.
       */
      queryClient.setQueryData(
        attendanceKeys.record(variables.employeeId, variables.date),
        createdAttendance
      );

      /*
       * Refresh related attendance data.
       */
      queryClient.invalidateQueries({
        queryKey: attendanceKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: attendanceKeys.employeesWithoutAttendance(variables.date),
      });
    },
  });
};

/**
 * Update attendance
 *
 * IMPORTANT:
 * The updated record is written directly into every
 * relevant React Query cache before the background
 * invalidation/refetch.
 *
 * This makes clock-in / clock-out / notes updates appear
 * immediately across the application.
 */
export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      _id,
      date,
      employeeId,
      updates,
    }: {
      _id: string;
      date: string;
      employeeId?: string;
      updates: Partial<AttendanceWithEmployee>;
    }) => window.electron.attendance.update(_id, date, updates),

    onSuccess: (updatedAttendance, variables) => {
      if (!updatedAttendance) return;

      const employeeId = updatedAttendance.employeeId ?? variables.employeeId;

      /*
       * -------------------------------------------------------
       * SINGLE ATTENDANCE
       * -------------------------------------------------------
       */

      queryClient.setQueryData(
        attendanceKeys.detail(variables._id),
        updatedAttendance
      );

      /*
       * -------------------------------------------------------
       * EMPLOYEE + DATE RECORD
       * -------------------------------------------------------
       */

      if (employeeId) {
        queryClient.setQueryData(
          attendanceKeys.record(employeeId, variables.date),
          updatedAttendance
        );
      }

      /*
       * -------------------------------------------------------
       * ATTENDANCE BY DATE
       * -------------------------------------------------------
       */

      queryClient.setQueryData<AttendanceWithEmployee[]>(
        attendanceKeys.byDate(variables.date),
        (old) => {
          if (!old) return old;

          return old.map((item) =>
            item._id === variables._id ? updatedAttendance : item
          );
        }
      );

      /*
       * -------------------------------------------------------
       * ATTENDANCE BY EMPLOYEE
       * -------------------------------------------------------
       */

      if (employeeId) {
        queryClient.setQueryData<AttendanceWithEmployee[]>(
          attendanceKeys.byEmployee(employeeId),
          (old) => {
            if (!old) return old;

            return old.map((item) =>
              item._id === variables._id ? updatedAttendance : item
            );
          }
        );
      }

      /*
       * -------------------------------------------------------
       * ALL ATTENDANCE
       * -------------------------------------------------------
       */

      queryClient.setQueryData<AttendanceWithEmployee[]>(
        attendanceKeys.list(),
        (old) => {
          if (!old) return old;

          return old.map((item) =>
            item._id === variables._id ? updatedAttendance : item
          );
        }
      );

      /*
       * IMPORTANT:
       *
       * Do NOT do this here:
       *
       * queryClient.invalidateQueries({
       *   queryKey: attendanceKeys.all,
       * });
       *
       * That refetch is what can cause the list to jump and
       * Editable to lose its focus.
       */
    },
  });
};

/**
 * Mark employees absent for a date
 */
export const useMarkAbsent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (date: string) => window.electron.attendance.markAbsent(date),

    onSuccess: (_, date) => {
      queryClient.invalidateQueries({
        queryKey: attendanceKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: attendanceKeys.byDate(date),
      });

      queryClient.invalidateQueries({
        queryKey: attendanceKeys.employeesWithoutAttendance(date),
      });
    },
  });
};

/**
 * Delete attendance
 */
export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (_id: string) => window.electron.attendance.delete(_id),

    onSuccess: (_, _id) => {
      /*
       * Remove individual detail cache.
       */
      queryClient.removeQueries({
        queryKey: attendanceKeys.detail(_id),
      });

      /*
       * Refresh all attendance lists.
       */
      queryClient.invalidateQueries({
        queryKey: attendanceKeys.all,
      });
    },
  });
};
