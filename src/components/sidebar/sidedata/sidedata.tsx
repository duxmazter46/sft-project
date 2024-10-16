import { ReactNode } from "react";
import { AiOutlineBars} from "react-icons/ai";
import { RiArrowDownSFill, RiArrowUpSFill} from "react-icons/ri";
import { TbClipboardCheck, TbBed } from "react-icons/tb";

export type ItemType = {
  iconClose: ReactNode;
  iconOpened: ReactNode;
  title: string;
  path?: string;
  icon: JSX.Element;
  subNav: { title: string; path: string; icon: JSX.Element }[];
};

export type SubmenuType = {
  subnav: { title: string; icon: JSX.Element }[];
};

export const SideData: ItemType[] = [
  {
    title: "Case",
    path: "",
    icon: <AiOutlineBars />,
    subNav: [
      {
        title: "Active Cases",
        path: "/mainpage",
        icon: <TbClipboardCheck />,
      },
      {
        title: "Admit Cases",
        path: "/admit",
        icon: <TbBed />,
      },
    ],
    iconClose: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,
  },
  {
    title: "Users",
    path: "/admin",
    icon: <AiOutlineBars />,
    subNav: [
      
    ],
    iconClose: null,
    iconOpened: null,
  },
];
