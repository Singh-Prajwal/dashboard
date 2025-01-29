import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter, fetchInventory } from "../redux/inventorySlice";
import { RootState, AppDispatch } from "../redux/store";

const Filters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.inventory.filters);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Update only the selected filter field
    dispatch(setFilter({ ...filters, [name]: value }));

    // Fetch inventory with the updated filters
    const updatedFilters = { ...filters, [name]: value };
    dispatch(fetchInventory(updatedFilters));
  };
  useEffect(() => {
    dispatch(fetchInventory(filters));
  });
  return (
    <div className="flex gap-4">
      <select
        name="condition"
        value={filters.condition || "all"} // Default to "all" if undefined
        onChange={handleFilterChange}
        className="p-2 border rounded"
      >
        <option value="">All</option>
        <option value="new">New</option>
        <option value="used">Used</option>
        <option value="cpo">CPO</option>
      </select>
      <select
        name="timestamp"
        value={filters.timestamp || "thisMonth"} // Default to "thisMonth" if undefined
        onChange={handleFilterChange}
        className="p-2 border rounded"
      >
        <option value="thisMonth">This Month</option>
        <option value="lastMonth">Last Month</option>
        <option value="last3Months">Last 3 Months</option>
        <option value="thisYear">This Year</option>
      </select>
    </div>
  );
};

export default Filters;
