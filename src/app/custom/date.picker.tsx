import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface MyDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
}

export function MyDatePicker({ selected, onChange }: MyDatePickerProps) {
  return (
    <div style={{ border: "1px solid #4a90e2", display: "inline-block", padding: '3px' }}>
      <DatePicker
        selected={selected}
        onChange={onChange}
        showTimeSelect
        dateFormat="Pp"
        timeIntervals={5}
      />
    </div>
  );
}
