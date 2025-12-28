import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LabelBottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState('home');

  // Sync with route
  React.useEffect(() => {
    if (location.pathname.startsWith('/shop')) setValue('shop');
    else if (location.pathname.startsWith('/profile')) setValue('profile');
    else if (location.pathname.startsWith('/contact')) setValue('contact');
    else setValue('home');
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 'home') navigate('/');
    else if (newValue === 'shop') navigate('/shop');
    else if (newValue === 'profile') navigate('/profile');
    else if (newValue === 'contact') navigate('/contact');
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      showLabels
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
        zIndex: 1300,
        bgcolor: '#1e40af',
        paddingY: 0.5,
        direction: 'rtl', // RTL direction
      }}
    >
      <BottomNavigationAction
        label="الرئيسية"
        value="home"
        icon={<HomeIcon />}
        sx={getActionStyle(value === 'home')}
      />
      <BottomNavigationAction
        label="المتجر"
        value="shop"
        icon={<StoreIcon />}
        sx={getActionStyle(value === 'shop')}
      />
      <BottomNavigationAction
        label="تواصل معنا"
        value="contact"
        icon={<ContactPhoneIcon />}
        sx={getActionStyle(value === 'contact')}
      />
      {/* <BottomNavigationAction
        label="اوردراتي"
        // value="profile"
        icon={<ShoppingBagIcon />}
        sx={getActionStyle(value === 'profile')}
      /> */}
    </BottomNavigation>
  );
}

// Helper style
function getActionStyle(isSelected) {
  return {
    color: 'white',
    borderRadius: '12px',
    mx: 0.5,
    transition: 'all 0.2s ease',
    ...(isSelected && {
      bgcolor: 'white',
      color: '#1e40af',
      transform: 'scale(1.1)',
      fontWeight: 'bold',
      '& .MuiSvgIcon-root': {
        color: '#1e40af',
      },
      '& .MuiBottomNavigationAction-label': {
        color: '#1e40af',
      },
    }),
    '& .MuiBottomNavigationAction-label': {
      fontSize: isSelected ? '0.75rem' : '0.7rem',
    },
    '& .MuiSvgIcon-root': {
      fontSize: isSelected ? '1.6rem' : '1.4rem',
    },
  };
}
