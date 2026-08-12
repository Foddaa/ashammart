import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CategoryIcon from '@mui/icons-material/Category';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

export default function FloatingGlassNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState('home');

  // ── Sync active tab with route + sidebar state ──
  // NOTE: both "shop" and "categories" live on the same "/shop" route,
  // distinguished only by `location.state.openSidebar`. Both the writer
  // (handleChange) and the reader (this effect) must use the SAME key,
  // or the tab highlight will always fall back to "shop".
  React.useEffect(() => {
    const path = location.pathname;
    const openSidebar = location.state?.openSidebar || false;

    if (path === '/shop') {
      setValue(openSidebar ? 'categories' : 'shop');
    } else if (path === '/favorites') {
      setValue('favorites');
    } else if (path === '/') {
      setValue('home');
    } else {
      setValue('home'); // fallback
    }
  }, [location.pathname, location.state?.openSidebar]);

  const handleChange = (event, newValue) => {
    setValue(newValue);

    switch (newValue) {
      case 'home':
        navigate('/');
        break;
      case 'shop':
        // Navigating to shop directly → sidebar closed
        navigate('/shop', { state: { openSidebar: false } });
        break;
      case 'categories':
        // Same route, sidebar open — this is what marks "categories" active
        navigate('/shop', { state: { openSidebar: true } });
        break;
      case 'favorites':
        navigate('/favorites');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1300,
        width: 'auto',
        minWidth: 320,
        maxWidth: '92%',
        background: 'rgba(10, 12, 18, 0.72)',
        backdropFilter: 'blur(20px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.3)',
        borderRadius: '60px',
        padding: '6px 12px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          backgroundColor: 'transparent',
          minHeight: 56,
          gap: { xs: 0.5, sm: 1 },
          direction: 'rtl',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 64,
            padding: '6px 12px',
            borderRadius: '40px',
            transition: 'all 0.2s ease',
            color: 'rgba(255, 255, 255, 0.35)',
            '& .MuiSvgIcon-root': {
              fontSize: 26,
              transition: 'all 0.2s ease',
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: 0.3,
              transition: 'all 0.2s ease',
              fontFamily: '"Inter", "Segoe UI", sans-serif',
            },
          },
        }}
      >
        <BottomNavigationAction
          label="Home"
          value="home"
          icon={<HomeIcon />}
          sx={getActiveStyle(value === 'home')}
        />
        <BottomNavigationAction
          label="Shop"
          value="shop"
          icon={<StoreIcon />}
          sx={getActiveStyle(value === 'shop')}
        />
        <BottomNavigationAction
          label="Categories"
          value="categories"
          icon={<CategoryIcon />}
          sx={getActiveStyle(value === 'categories')}
        />
        <BottomNavigationAction
          label="Favorites"
          value="favorites"
          icon={<FavoriteIcon />}
          sx={getActiveStyle(value === 'favorites')}
        />
      </BottomNavigation>
    </Box>
  );
}

function getActiveStyle(isActive) {
  return {
    ...(isActive && {
      color: '#ffffff !important',
      transform: 'scale(1.04)',
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      border: '1px solid rgba(59, 130, 246, 0.25)',
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.06)',
      '& .MuiSvgIcon-root': {
        color: '#60a5fa !important',
        transform: 'scale(1.1)',
      },
      '& .MuiBottomNavigationAction-label': {
        color: '#93c5fd !important',
        fontWeight: 600,
      },
    }),
    ...(!isActive && {
      '&:hover': {
        color: 'rgba(255,255,255,0.7) !important',
        backgroundColor: 'rgba(255,255,255,0.04)',
        transform: 'scale(1.02)',
        '& .MuiSvgIcon-root': {
          color: 'rgba(255,255,255,0.6)',
        },
      },
    }),
    borderRadius: '40px',
    transition: 'all 0.2s ease',
    '& .MuiSvgIcon-root': {
      transition: 'all 0.2s ease',
    },
    '& .MuiBottomNavigationAction-label': {
      transition: 'all 0.2s ease',
    },
  };
}