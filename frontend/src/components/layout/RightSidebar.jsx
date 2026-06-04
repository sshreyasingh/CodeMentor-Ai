import { Box, Paper, Tabs, Tab, Badge } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import RateReviewIcon from '@mui/icons-material/RateReview';

const tabs = [
  { key: 'chat', icon: <ChatIcon />, label: 'Chat' },
  { key: 'users', icon: <PeopleIcon />, label: 'Users' },
  { key: 'ai', icon: <SmartToyIcon />, label: 'AI' },
  { key: 'review', icon: <RateReviewIcon />, label: 'Review' },
];

const panelVariants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
};

const RightSidebar = ({ activeTab, onTabChange, onlineCount, children }) => (
  <Paper
    sx={{
      width: 380,
      minWidth: 380,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 0,
      borderLeft: 1,
      borderColor: 'divider',
      bgcolor: '#111827',
      overflow: 'hidden',
    }}
  >
    <Tabs
      value={activeTab}
      onChange={(_, v) => onTabChange(v)}
      variant="fullWidth"
      sx={{
        minHeight: 44,
        borderBottom: 1,
        borderColor: 'divider',
        '& .MuiTabs-indicator': { height: 2, bgcolor: 'primary.main' },
        '& .MuiTab-root': {
          minHeight: 44,
          minWidth: 0,
          p: 1,
          textTransform: 'none',
          fontSize: 12,
          fontWeight: 500,
          color: 'text.secondary',
          '&.Mui-selected': { color: 'primary.main' },
        },
      }}
    >
      {tabs.map((t) => (
        <Tab
          key={t.key}
          value={t.key}
          icon={
            t.key === 'users' ? (
              <Badge badgeContent={onlineCount} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: 9, height: 16, minWidth: 16 } }}>
                {t.icon}
              </Badge>
            ) : (
              t.icon
            )
          }
          iconPosition="start"
          label={t.label}
          sx={{ gap: 0.75 }}
        />
      ))}
    </Tabs>

    <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={panelVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </Box>
  </Paper>
);

export default RightSidebar;
