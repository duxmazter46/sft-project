import { Link } from "react-router-dom";
import styled from "styled-components";
import { ItemType } from "../sidedata/sidedata";
import { useState } from "react";

const SideLink = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  height: 35px;
  width: 100%;
  font-size: 14px;
  text-decoration: none;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
  border-radius: 0px 30px 30px 0px;
  border-bottom: 4px solid #00000;
  background-color: #eff9ef;
  font-weight: 500;
  font-family: "Poppins", sans-serif;
  color: #3e3f42;
  overflow: hidden;
  transition: all 0.1s ease;

  &:hover {
    box-shadow: 0 2px 0 0.05rem #6bdbd4;
    color: black;
    cursor: pointer;
  }

  @media (max-width: 992px) {
    font-size: 14px;
    height: 35px;
  }

  @media (max-width: 992px) {
    font-size: 14px;
    height: 30px;
  }
`;

const SidebarLabel = styled.span`
  display: flex;
  align-items: center;
  margin-left: 15px;

  @media (max-width: 992px) {
    margin-left: 10px;
  }

  @media (max-width: 992px) {
    margin-left: 8px;
  }
`;

const DropdownLink = styled(Link)`
  display: flex;
  align-items: center;
  margin-left: 20px;
  color: #3e3f42;
  border-bottom: 0.5px solid #ACCEC7;
  margin-bottom: 5px;
  cursor: pointer;
  font-weight: 500;
  font-family: "Poppins", sans-serif;
  font-size: 14px;

  @media (max-width: 992px) {
    font-size: 14px;
    margin-left: 15px;
    padding-bottom: 8px;
  }

  @media (max-width: 992px) {
    font-size: 14px;
    margin-left: 10px;
    padding-bottom: 6px;
  }
`;

const SubmenuContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Submenu: React.FC<{ item: ItemType }> = ({ item }) => {
  const [subnav, setSubnav] = useState(false);
  const toggleSubnav = () => setSubnav(!subnav);

  return (
    <SubmenuContainer>
      <SideLink
        to={item.path || ""}
        onClick={item.subNav ? toggleSubnav : undefined}
      >
        <SidebarLabel>
          <span className="p-2">{item.icon}</span>
          {item.title}
        </SidebarLabel>
        <span className="flex items-center p-2">
          {item.subNav && (subnav ? item.iconOpened : item.iconClose)}
        </span>
      </SideLink>
      {subnav &&
        item.subNav?.map((subItem, index) => (
          <DropdownLink to={subItem.path} key={index}>
            <span className="p-2">{subItem.icon}</span>
            <SidebarLabel>{subItem.title}</SidebarLabel>
          </DropdownLink>
        ))}
    </SubmenuContainer>
  );
};

export default Submenu;
