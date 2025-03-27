// import { appRoutes, pluginRoutes } from "@/core/utils/routeNames";
import DashboardIcon from '@mui/icons-material/Dashboard';
import { appRoutes } from "../../utils/routeNames";

import PaidIcon from '@mui/icons-material/Paid';

export interface IWholeMenuProps {
  id: number;
  title: string;
  icon: React.ElementType;
  route?: string;
  menus?: IWholeMenuProps[];
}

export const wholeMenu: IWholeMenuProps[] = [
  {
    id: 1,
    title: "Dashboard",
    icon: DashboardIcon,
    route: `${appRoutes?.dashboard}`,
  },
  {
    id: 2,
    title: "Add Transaction",
    icon: PaidIcon,
    route: `${appRoutes?.addTransaction}`,
  },
];
