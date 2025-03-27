import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { supabase } from "../../lib/supabase";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import CustomTable from "./components/Customtable";
import CustomModal from "../../components/Modal";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";

// Transaction type for TypeScript
type Transaction = {
  id: number;
  amount: number;
  category: string;
  type: "income" | "expense";
  created_at: string;
};

// Fetch transactions with optional filters
async function fetchTransactions(
  userId: string,
  filters: {
    type?: "income" | "expense";
    category?: string;
    startDate?: string;
    endDate?: string;
  } = {}
) {
  let query = supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (filters.type) query = query.eq("type", filters.type);
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.startDate) query = query.gte("created_at", filters.startDate);
  if (filters.endDate) query = query.lte("created_at", filters.endDate);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Add transaction function
async function addTransaction({
  userId,
  amount,
  category,
  type,
}: {
  userId: string;
  amount: number;
  category: string;
  type: "income" | "expense";
}) {
  const { data, error } = await supabase
    .from("transactions")
    .insert([{ user_id: userId, amount, category, type }])
    .select("id")
    .single();

  if (error) throw error;
  return data;
}

export default function TransactionManager() {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    type?: "income" | "expense";
    category?: string;
    startDate?: string;
    endDate?: string;
  }>({});
  const [open, setOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUserId(data?.user?.id || null);
    }
    fetchUser();
  }, []);

  // Fetch transactions
  const {
    data: transactions = [],
  } = useQuery({
    queryKey: ["transactions", userId, filters],
    queryFn: () => fetchTransactions(userId!, filters),
    enabled: !!userId,
  });

  // Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<{
    amount: string;
    category: string;
    type: "income" | "expense";
  }>();

  // Mutation for adding transactions
  const mutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", userId] });
      reset(); // Reset form on success
      setOpen(false); // Close modal
    },
  });

  // Handle form submission
  const onSubmit = (data: {
    amount: string;
    category: string;
    type: "income" | "expense";
  }) => {
    const amount = parseFloat(data.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    mutation.mutate({
      userId: userId!,
      amount,
      category: data.category,
      type: data.type,
    });
  };

  const categories = [...new Set(transactions.map((t) => t.category))];

  if (!userId) return <p>Loading user...</p>;

  return (
    <div className="space-y-4 p-4">
      <div className="flex gap-4 mb-4">
        {/* Transaction Type Filter */}
        <Select
          onValueChange={(val) =>
            setFilters((prev) => ({
              ...prev,
              type: val as "income" | "expense",
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Transaction Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select
          onValueChange={(val) =>
            setFilters((prev) => ({ ...prev, category: val }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category, index) => (
              <SelectItem key={`${category}-${index}`} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Filters */}
        <Input
          type="date"
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, startDate: e.target.value }))
          }
        />
        <Input
          type="date"
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, endDate: e.target.value }))
          }
        />

        {/* Add Transaction Button */}
        <Button onClick={() => setOpen(true)}>Add Transaction</Button>
      </div>

      {/* Transactions Table */}
      <CustomTable
        transactions={transactions || []}
        setEditingTransaction={setEditingTransaction}
        editingTransaction={editingTransaction}
        userId={userId}
      />

      {/* Add Transaction Modal */}
      {open && (
        <CustomModal isOpen={open} onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-4 p-4 border rounded-lg">
            <h2 className="text-lg font-semibold">Add Transaction</h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <Input
                type="number"
                placeholder="Amount"
                {...register("amount", { required: "Amount is required" })}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
              )}

              <Input
                type="text"
                placeholder="Category"
                {...register("category", { required: "Category is required" })}
              />
              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}

              {/* Toggle for Income & Expense */}
              <ToggleGroup
                type="single"
                value={watch("type")}
                onValueChange={(val) =>
                  val && setValue("type", val as "income" | "expense")
                }
              >
                <ToggleGroupItem value="income">Income</ToggleGroupItem>
                <ToggleGroupItem value="expense">Expense</ToggleGroupItem>
              </ToggleGroup>

              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Adding..." : "Add Transaction"}
              </Button>
            </form>
          </div>
        </CustomModal>
      )}
    </div>
  );
}
