import { Box, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PeopleIcon from '@mui/icons-material/People';

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.06, duration: 0.25 } }),
};

const ActiveUsersPanel = ({ participants, onlineCount, myColor, embedded = false }) => {
  const header = (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PeopleIcon sx={{ fontSize: 18, color: 'primary.main' }} />
        <Typography variant="subtitle2" fontWeight={600}>Participants</Typography>
      </Box>
      <Chip label={`${onlineCount} online`} size="small" color="primary" variant="outlined" sx={{ height: 22, fontSize: 11 }} />
    </Box>
  );

  const list = (
    <Box sx={{ flex: 1, overflow: 'auto' }}>
      {participants.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">No one else is here yet</Typography>
        </Box>
      ) : (
        <List dense disablePadding>
          {participants.map((p, i) => (
            <motion.div key={p.userId} custom={i} initial="hidden" animate="visible" variants={itemVariants}>
              <ListItem sx={{ pl: 2, pr: 2, py: 1 }}>
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar alt={p.name} src={p.avatar} sx={{ width: 34, height: 34, fontSize: 14 }}>
                      {p.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <FiberManualRecordIcon
                      sx={{
                        position: 'absolute', bottom: -2, right: -2, fontSize: 14,
                        color: p.color || '#1976d2',
                        filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.5))',
                      }}
                    />
                  </Box>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="body2" fontWeight={500} noWrap>{p.name || 'Anonymous'}</Typography>}
                  secondary={
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <FiberManualRecordIcon sx={{ fontSize: 8, color: '#22c55e' }} />
                      <Typography variant="caption" color="text.secondary">online</Typography>
                    </Box>
                  }
                />
              </ListItem>
            </motion.div>
          ))}
        </List>
      )}
    </Box>
  );

  if (embedded) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {header}
        {list}
      </Box>
    );
  }

  return (
    <Box sx={{ width: 240, minWidth: 240, height: '100%', borderLeft: 1, borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column' }}>
      {header}
      {list}
    </Box>
  );
};

export default ActiveUsersPanel;
