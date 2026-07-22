import { Box, IconButton, Badge, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import RateReviewIcon from '@mui/icons-material/RateReview';

const tabs = [
  { key: 'chat', icon: ChatIcon, label: 'Chat' },
  { key: 'users', icon: PeopleIcon, label: 'Users' },
  { key: 'ai', icon: SmartToyIcon, label: 'AI' },
  { key: 'review', icon: RateReviewIcon, label: 'Review' },
];

const MobileTabBar = ({ activeTab, onTabChange, onlineCount }) => (
  <Box
    sx={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      py: 0.75,
      px: 1,
      bgcolor: 'rgba(12,18,35,0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      zIndex: 1200,
      pb: 1.25,
    }}
  >
    {tabs.map((t) => {
      const isActive = activeTab === t.key;
      const Icon = t.icon;
      const button = (
        <IconButton
          key={t.key}
          onClick={() => onTabChange(t.key)}
          sx={{
            flexDirection: 'column',
            borderRadius: 2,
            color: isActive ? '#818cf8' : '#64748B',
            gap: 0.25,
            p: 1,
            transition: 'color 0.2s',
          }}
        >
          {t.key === 'users' ? (
            <Badge
              badgeContent={onlineCount}
              color="primary"
              sx={{ '& .MuiBadge-badge': { fontSize: 9, height: 16, minWidth: 16 } }}
            >
              <Icon sx={{ fontSize: 22 }} />
            </Badge>
          ) : (
            <Icon sx={{ fontSize: 22 }} />
          )}
          <Typography variant="caption" sx={{ fontSize: 10, fontWeight: isActive ? 600 : 400 }}>
            {t.label}
          </Typography>
        </IconButton>
      );

      return button;
    })}
  </Box>
);

export default MobileTabBar;
