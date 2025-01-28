import React from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { RootState } from "../redux/store";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Metrics: React.FC = () => {
  const { data } = useSelector((state: RootState) => state.inventory);

  // Aggregate data by product type (new, used, cpo) for count and price
  const aggregateVehicles = (data: any) => {
    const aggregation = data.reduce(
      (acc: any, item: any) => {
        const { product_type, price } = item;

        if (["new", "used", "cpo"].includes(product_type)) {
          acc[product_type].count += 1;
          acc[product_type].totalPrice += price;
        }

        return acc;
      },
      {
        new: { count: 0, totalPrice: 0 },
        used: { count: 0, totalPrice: 0 },
        cpo: { count: 0, totalPrice: 0 },
      }
    );

    return aggregation;
  };

  // Aggregate data for count and price
  const aggregatedData = aggregateVehicles(data);

  // Prepare data for histograms (count and total price)
  const productTypes = ["new", "used", "cpo"];
  const countData = productTypes.map((type) => aggregatedData[type].count);
  const priceData = productTypes.map((type) => aggregatedData[type].totalPrice);

  const countHistogramData = {
    labels: productTypes,
    datasets: [
      {
        label: "Vehicle Count",
        data: countData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const priceHistogramData = {
    labels: productTypes,
    datasets: [
      {
        label: "Total Price",
        data: priceData,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Product Type",
        },
      },
      y: {
        title: {
          display: true,
          text: "Count / Price ($)",
        },
        beginAtZero: true,
      },
    },
  };
  const calculateTotalCount = (type: string) => {
    return data.filter((item) => item.condition === type).length;
  };

  // Function to calculate the total price of vehicles for a given product type
  const calculateTotalPrice = (type: string) => {
    return data
      .filter((item) => item.condition === type)
      .reduce((acc, item) => acc + item.price, 0);
  };

  // Function to calculate the average price of vehicles for a given product type
  const calculateAvgPrice = (type: string) => {
    const filteredData = data.filter((item) => item.condition === type);
    const totalPrice = filteredData.reduce((acc, item) => acc + item.price, 0);
    const count = filteredData.length;
    return count > 0 ? totalPrice / count : 0;
  };

  // Metrics for each product type
  const newCount = calculateTotalCount("new");
  const usedCount = calculateTotalCount("used");
  const cpoCount = calculateTotalCount("cpo");

  const newPrice = calculateTotalPrice("new");
  const usedPrice = calculateTotalPrice("used");
  const cpoPrice = calculateTotalPrice("cpo");

  const newAvgPrice = calculateAvgPrice("new");
  const usedAvgPrice = calculateAvgPrice("used");
  const cpoAvgPrice = calculateAvgPrice("cpo");
  return (
    <div className="p-4">
      <h6 className="text-lg font-bold mb-4">Recent Data Gathered</h6>
      {/* Inline Display for Total Count, Total Price, and Average Price */}
      <div className="space-y-4">
        {/* New Inventory Metrics */}
        <div className="d-inline-flex w-100  banner-container border p-4 rounded shadow">
          <div className="d-inline-flex w-100">
            {/* New Inventory Metrics */}
            <div className="d-flex flex-column align-items-center mx-4 banner">
              <p className="font-weight-bold">
                <strong>{newCount}</strong>
              </p>
              <p className="orange">Total New Units</p>
            </div>
            <div className="d-flex flex-column align-items-center mx-4 banner">
              <p className="font-weight-bold">
                <strong>${newPrice}</strong>
              </p>
              <p className="orange">New MSRP</p>
            </div>
            <div className="d-flex flex-column align-items-center mx-4 banner">
              <p className="font-weight-bold">
                <strong>${newAvgPrice.toFixed(2)}</strong>
              </p>
              <p className="orange">Average New MSRP</p>
            </div>
          </div>

          <div className="d-inline-flex w-100">
            {/* Used Inventory Metrics */}
            <div className="d-flex flex-column align-items-center mx-4 banner">
              <p className="font-weight-bold">
                <strong>{usedCount}</strong>
              </p>
              <p className="orange">Total Used Units</p>
            </div>
            <div className="d-flex flex-column align-items-center mx-4 banner">
              <p className="font-weight-bold">
                <strong>${usedPrice}</strong>
              </p>
              <p className="orange">Used MSRP</p>
            </div>
            <div className="d-flex flex-column align-items-center mx-4 banner">
              <p className="font-weight-bold">
                <strong>${usedAvgPrice.toFixed(2)}</strong>
              </p>
              <p className="orange">Average Used MSRP</p>
            </div>
          </div>

          <div className="d-inline-flex w-100">
            {/* CPO Inventory Metrics */}
            <div className="d-flex flex-column align-items-center mx-4 banner">
              <p className="font-weight-bold">
                <strong>{cpoCount}</strong>
              </p>
              <p className="orange">Total CPO Units</p>
            </div>
            <div className="d-flex flex-column align-items-center mx-4 banner">
              <p className="font-weight-bold">
                <strong>${cpoPrice}</strong>
              </p>
              <p className="orange">CPO MSRP</p>
            </div>
            <div className="d-flex flex-column align-items-center mx-4 banner">
              <p className="font-weight-bold">
                <strong>${cpoAvgPrice.toFixed(2)}</strong>
              </p>
              <p className="orange">Average CPO MSRP</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Count Histogram */}
        <br />
        <div>
          <h6 className="text-md font-semibold mb-2">Inventory Count</h6>
          <div
            className="chart-container"
            style={{ height: "400px", width: "1000px" }}
          >
            <Bar data={countHistogramData} options={options} />
          </div>
        </div>

        {/* Price Histogram */}
        <div>
          <h3 className="text-md font-semibold mb-2">Total Price</h3>
          <div
            className="chart-container"
            style={{ height: "400px", width: "1000px" }}
          >
            <Bar data={priceHistogramData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
