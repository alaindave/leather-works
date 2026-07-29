import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Select from "react-select";
function getLast7Days() {
    const days = [];
    let i = 0;
    while (days.length < 7) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        // const dayOfWeek = date.getDay();
        // Skip weekend
        // if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        days.push({
            label: formatDate(date),
            value: date.toISOString().split("T")[0],
        });
        // }
        i++;
    }
    return days;
}
function formatDate(date) {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const formatted = date.toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
    });
    return isToday ? `Aujurd'hui:${formatted} ` : formatted;
}
export default function DateDropdown({ onChange }) {
    const options = getLast7Days();
    const [selected, setSelected] = useState(options[0] || null);
    function handleChange(option) {
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
    return (_jsx(Select, { options: options, value: selected, onChange: handleChange, isSearchable: false, menuPlacement: "top" }));
}
