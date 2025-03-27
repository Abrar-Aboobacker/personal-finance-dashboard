import { gql } from "@apollo/client";

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats($userId: String!) {
    user_finance_summary(where: { user_id: { _eq: $userId } }) {
      total_income
      total_expense
      balance
    }
  }
`;
