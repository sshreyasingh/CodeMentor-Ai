import { Card, CardContent, Typography, Chip } from '@mui/material';

const SessionCard = ({ session }) => (
  <Card sx={{ minWidth: 275, cursor: 'pointer' }}>
    <CardContent>
      <Typography variant="h6">{session.title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {session.description || 'No description'}
      </Typography>
      <Chip
        label={session.language}
        size="small"
        sx={{ mt: 1 }}
      />
    </CardContent>
  </Card>
);

export default SessionCard;
