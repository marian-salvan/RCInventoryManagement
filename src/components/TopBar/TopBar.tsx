import { FC } from 'react';
import { Collapse, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarText, NavbarToggler, UncontrolledDropdown } from 'reactstrap';
import './TopBar.css';

interface TopBarProps {}

const TopBar: FC<TopBarProps> = () => {
  return ( 
<div>
  <Navbar
    color="light"
    expand="md"
    light
  >
    <NavbarToggler onClick={function noRefCheck(){}} />
    <Collapse navbar  className="top-nav">
      <Nav
        className="ms-auto"
        navbar
      >
        <NavbarText>
          Campania curenta: 
        </NavbarText>
        <UncontrolledDropdown direction='down'>
          <DropdownToggle caret nav>
            Options
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem>
              Option 1
            </DropdownItem>
            <DropdownItem>
              Option 2
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </Collapse>
  </Navbar>
</div>
  );
}

export default TopBar;
