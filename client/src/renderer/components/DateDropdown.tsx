import { useEffect, useState } from "react";
import Select from "react-select";

const formatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function getLast7Days() {
  const days = [];
  let i = 0;

  while (days.length < 30) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();

    // Skip weekend
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      days.push({
        label: formatDate(date),
        value: formatter.format(date),
      });
    }

    i++;
  }

  return days;
}

function formatDate(date: Date) {
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  const formatted = date.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  return isToday ? `Aujurd'hui:${formatted} ` : formatted;
}

interface Props {
  onChange?: (date: string) => void;
}

interface Option {
  label: string;
  value: string;
}

export default function DateDropdown({ onChange }: Props) {
  const options: Option[] = getLast7Days();
  const [selected, setSelected] = useState<Option | null>(options[0] || null);
  function handleChange(option: Option | null) {
    if (option) {
      setSelected(option);
      onChange?.(option.value);
    }
  }

  useEffect(() => {
    console.log("DateDropdown mounted");
    return () => {
      console.log("DateDropdown unmounted");
    };
  }, []);

  return (
    <Select
      options={options}
      value={selected}
      onChange={handleChange}
      isSearchable={false}
      menuPlacement="top"
    />
  );
}
