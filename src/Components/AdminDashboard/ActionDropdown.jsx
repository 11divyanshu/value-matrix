import { useState } from "react";
const options = ["Approve", "Forwarded"];
function ActionDropdown() {
  const [selected, setSelected] = useState(options[0]);
  return (
    <form>
      <select 
       value={selected} 
       onChange={e => setSelected(e.target.value)}>
        {options.map((value) => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </select>
    </form>
  );
}
export default ActionDropdown;