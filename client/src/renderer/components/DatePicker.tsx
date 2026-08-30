import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale";
import { Box, Flex, FormControl } from "@chakra-ui/react";

import "react-datepicker/dist/react-datepicker.css";

registerLocale("fr", fr);

export interface DateRange {
  startDate: string | Date;
  endDate: string | Date;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

function parseDate(dateString?: string | Date): Date | null {
  if (!dateString) return null;
  if (dateString instanceof Date) return null;
  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

/**
 * Convert Date → YYYY-MM-DD
 */
function formatDatabaseDate(date: Date | null): string {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const today = new Date();
const thirtyDaysAgo = new Date(today);
thirtyDaysAgo.setDate(today.getDate() - 30);

/*
 * ============================================================
 * COMPONENT
 * ============================================================
 */

export default function DateRangePicker({
  value,
  onChange,
}: DateRangePickerProps) {
  console.log("DEFAULT RANGE", value);
  const startDate = parseDate(value.startDate);
  const endDate = parseDate(value.endDate);

  /*
   * ============================================================
   * START DATE
   * ============================================================
   */

  const handleStartDateChange = (date: Date | null) => {
    if (!date) {
      onChange({
        startDate: "",
        endDate: value.endDate,
      });

      return;
    }

    const newStartDate = formatDatabaseDate(date);

    /*
     * If the new start date is after the current end date,
     * clear the end date.
     */
    const shouldClearEndDate = value.endDate && newStartDate > value.endDate;

    onChange({
      startDate: newStartDate,
      endDate: shouldClearEndDate ? "" : value.endDate,
    });
  };

  /*
   * ============================================================
   * END DATE
   * ============================================================
   */

  const handleEndDateChange = (date: Date | null) => {
    if (!date) {
      onChange({
        ...value,
        endDate: "",
      });

      return;
    }

    onChange({
      ...value,
      endDate: formatDatabaseDate(date),
    });
  };

  /*
   * ============================================================
   * VALIDATION
   * ============================================================
   */

  const invalidRange =
    Boolean(value.startDate) &&
    Boolean(value.endDate) &&
    value.endDate < value.startDate;

  return (
    <Box>
      <Flex gap={2} align="end" flexWrap="wrap">
        {/* ================================================== */}
        {/* START DATE */}
        {/* ================================================== */}

        <FormControl width="auto" minW="180px" isInvalid={invalidRange}>
          <DatePicker
            selected={startDate ?? new Date(thirtyDaysAgo)}
            onChange={handleStartDateChange}
            locale="fr"
            dateFormat="dd/MM/yyyy"
            placeholderText="JJ/MM/AAAA"
            showPopperArrow={false}
            isClearable={false}
            className="date-range-picker-input"
          />
        </FormControl>

        {/* ================================================== */}
        {/* END DATE */}
        {/* ================================================== */}

        <FormControl width="auto" minW="180px" isInvalid={invalidRange}>
          <DatePicker
            selected={endDate ?? new Date(today)}
            onChange={handleEndDateChange}
            locale="fr"
            dateFormat="dd/MM/yyyy"
            placeholderText="JJ/MM/AAAA"
            minDate={startDate ?? undefined}
            showPopperArrow={false}
            isClearable={false}
            className="date-range-picker-input"
          />
        </FormControl>
      </Flex>

      {/* ==================================================== */}
      {/* STYLES */}
      {/* ==================================================== */}

      <style>
        {`
          .date-range-picker-input {
            width: 180px;
            height: 40px;
            padding: 0 12px;
            border: 1px solid #E2E8F0;
            border-radius: 6px;
            background: white;
            font-size: 17px;
            color: #1A202C;
            outline: none;
            transition: border-color 0.15s ease,
                        box-shadow 0.15s ease;
          }

          .date-range-picker-input:hover {
            border-color: #CBD5E0;
          }

          .date-range-picker-input:focus {
            border-color: #3182CE;
            box-shadow: 0 0 0 1px #3182CE;
          }

          .date-range-picker-input::placeholder {
            color: #A0AEC0;
          }

          .react-datepicker {
            font-family: inherit;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            overflow: hidden;
          }

          .react-datepicker__header {
            background: white;
            border-bottom: 1px solid #E2E8F0;
          }

          .react-datepicker__current-month {
            font-size: 17px;
            font-weight: 600;
            color: #1A202C;
          }

          .react-datepicker__day-name {
            color: #718096;
            font-size: 12px;
          }

          .react-datepicker__day {
            border-radius: 4px;
            font-size: 13px;
          }

          .react-datepicker__day:hover {
            border-radius: 4px;
          }

          .react-datepicker__day--selected,
          .react-datepicker__day--keyboard-selected {
            border-radius: 4px;
          }

          .react-datepicker__navigation {
            top: 8px;
          }
        `}
      </style>
    </Box>
  );
}
