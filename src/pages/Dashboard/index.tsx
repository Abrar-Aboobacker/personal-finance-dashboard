import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import React from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUserId(data?.user?.id || null);
    }
    fetchUser();
  }, []);

  const {
    data: financeData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["financeSummary", userId],
    queryFn: async () => {
      const { data: incomeData, error: incomeError } = await supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", userId)
        .eq("type", "income");

      const { data: expenseData, error: expenseError } = await supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", userId)
        .eq("type", "expense");

      if (incomeError || expenseError) {
        throw new Error(incomeError?.message || expenseError?.message);
      }

      const totalIncome =
        incomeData?.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0) || 0;
      const totalExpense =
        expenseData?.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0) || 0;

      return {
        total_income: totalIncome.toFixed(2),
        total_expense: totalExpense.toFixed(2),
        balance: (totalIncome - totalExpense).toFixed(2),
      };
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const pieData = [
    { name: "Income", value: parseFloat(financeData?.total_income ?? "0") },
    { name: "Expenses", value: parseFloat(financeData?.total_expense ?? "0") },
  ];

  const barData = [
    { name: "Income", amount: parseFloat(financeData?.total_income ?? "0") },
    { name: "Expenses", amount: parseFloat(financeData?.total_expense ?? "0") },
  ];

  const COLORS = ["#4CAF50", "#F44336"];

  return (
    <div className="p-4 grid gap-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-green-100 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-green-800">Total Income</h3>
          <p className="text-2xl font-bold text-green-900">₹ {financeData?.total_income ?? "0.00"}</p>
        </div>
        <div className="p-4 bg-red-100 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-red-800">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-900">₹ {financeData?.total_expense ?? 0}</p>
        </div>
        <div className="p-4 bg-blue-100 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-blue-800">Balance</h3>
          <p className="text-2xl font-bold text-blue-900">₹ {financeData?.balance ?? 0} </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-center">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-center">Financial Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
