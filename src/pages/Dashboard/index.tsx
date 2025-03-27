import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import React from "react";

const Dashboard = async () => {
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      console.log(data, "what");
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
      // Fetch aggregated transaction data
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

      // Calculate totals
      const totalIncome =
        incomeData?.reduce(
          (sum, transaction) => sum + parseFloat(transaction.amount),
          0
        ) || 0;

      const totalExpense =
        expenseData?.reduce(
          (sum, transaction) => sum + parseFloat(transaction.amount),
          0
        ) || 0;

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

  // Show alternative UI when no data exists
  if (
    !financeData ||
    (parseFloat(financeData.total_income) === 0 &&
      parseFloat(financeData.total_expense) === 0)
  ) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold">No Financial Data Available</h3>
        <p>Please add transactions to see your summary.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <div className="p-4 bg-green-100 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-green-800">Total Income</h3>
        <p className="text-2xl font-bold text-green-900">
          ₹ {financeData.total_income}
        </p>
      </div>
      <div className="p-4 bg-red-100 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-red-800">Total Expenses</h3>
        <p className="text-2xl font-bold text-red-900">
          ₹ {financeData.total_expense}
        </p>
      </div>
      <div className="p-4 bg-blue-100 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-blue-800">Balance</h3>
        <p className="text-2xl font-bold text-blue-900">
          ₹ {financeData.balance}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
