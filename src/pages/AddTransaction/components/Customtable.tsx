import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Edit, Trash2 } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CustomTable = ({ transactions, setEditingTransaction, editingTransaction, userId }) => {
  const queryClient = useQueryClient();

  // Delete transaction function
  async function deleteTransaction(transactionId: number) {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transactionId);

    if (error) throw error;
  }

  // Update transaction function
  async function updateTransaction({
    transactionId,
    updates,
  }: {
    transactionId: number;
    updates: Partial<Omit<Transaction, "id" | "created_at">>;
  }) {
    const { error } = await supabase
      .from("transactions")
      .update(updates)
      .eq("id", transactionId);

    if (error) throw error;
  }

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", userId] });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", userId] });
      setEditingTransaction(null);
    },
  });

  const renderTransactionRow = (transaction: Transaction) => {
    if (editingTransaction?.id === transaction.id) {
      return (
        <TableRow key={transaction.id}>
          <TableCell>
            <Input
              type="number"
              defaultValue={transaction.amount}
              onChange={(e) =>
                setEditingTransaction((prev) =>
                  prev ? { ...prev, amount: parseFloat(e.target.value) } : null
                )
              }
            />
          </TableCell>
          <TableCell>
            <Input
              defaultValue={transaction.category}
              onChange={(e) =>
                setEditingTransaction((prev) =>
                  prev ? { ...prev, category: e.target.value } : null
                )
              }
            />
          </TableCell>
          <TableCell>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (editingTransaction) {
                    updateMutation.mutate({
                      transactionId: transaction.id,
                      updates: {
                        amount: editingTransaction.amount,
                        category: editingTransaction.category,
                      },
                    });
                  }
                }}
              >
                Save
              </Button>
              <Button variant="ghost" onClick={() => setEditingTransaction(null)}>
                Cancel
              </Button>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    // Normal row render
    return (
      <TableRow key={transaction.id}>
        <TableCell>{transaction.amount}</TableCell>
        <TableCell>{transaction.category}</TableCell>
        <TableCell>{transaction.type}</TableCell>
        <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => setEditingTransaction(transaction)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => deleteMutation.mutate(transaction.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <TableContainer sx={{ mt: 5 }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Amount</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length > 0 ? (
            transactions.map(renderTransactionRow)
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
