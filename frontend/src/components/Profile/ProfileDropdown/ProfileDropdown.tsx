import { ReactNode } from "react";
import { CiSettings } from "react-icons/ci";
import { HiLogout } from "react-icons/hi";


export type ProfileDropdownProps ={
    iconClose: ReactNode;
    iconOpened: ReactNode;

    title: string;
    path: string;


    icon: JSX.Element;
  
    subNav: { title: string; path: string ; icon:JSX.Element }[];

};

export type SubProfileType = {

    subnav: { title: string; icon:JSX.Element }[];
};



export const ProfileDropdown: ProfileDropdownProps[] = [

    {
        title: 'Profile',
        path: '',
        icon: <CiSettings />,
        iconClose: undefined,
        iconOpened: undefined,
        subNav: []
    },{
        title: 'Settings',
        path: '/settings',
        icon: <CiSettings />,
        iconClose: undefined,
        iconOpened: undefined,
        subNav: []
    },{
        title: 'Logout',
        path: '/logout',
        icon: <HiLogout />,
        iconClose: undefined,
        iconOpened: undefined,
        subNav: []
    },

]

