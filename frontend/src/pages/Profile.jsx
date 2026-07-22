import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Avatar, Grid, Divider, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import GitHubIcon from '@mui/icons-material/GitHub';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RateReviewIcon from '@mui/icons-material/RateReview';
import GroupIcon from '@mui/icons-material/Group';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import StatCard from '../components/common/StatCard';
import CircularScore from '../components/common/CircularScore';
import { SkeletonCard, SkeletonText, SkeletonAvatar } from '../components/common/SkeletonLoader';
import ErrorDisplay from '../components/common/ErrorDisplay';

const Profile = () => {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState(null);
  const [roomsData, setRoomsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');
  const [roomsError, setRoomsError] = useState('');

  const fetchData = async () => {
    setStatsLoading(true);
    setRoomsLoading(true);
    setStatsError('');
    setRoomsError('');
    try {
      const [statsRes, roomsRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/rooms'),
      ]);
      setStatsData(statsRes.data);
      setRoomsData(roomsRes.data.rooms || []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load data';
      setStatsError(msg);
      setRoomsError(msg);
    } finally {
      setStatsLoading(false);
      setRoomsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const myRooms = (roomsData || []).filter((r) => r.owner?._id === user?._id);
  const joinedRooms = (roomsData || []).filter((r) => r.owner?._id !== user?._id && r.participants?.some((p) => p._id === user?._id));

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" fontWeight={700} sx={{ color: '#FFFFFF', mb: 3, letterSpacing: '-0.02em' }}>
        <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Profile
      </Typography>

      {/* User Info Card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Card sx={{ borderRadius: 3, mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Avatar
                src={user?.avatar}
                alt={user?.name}
                sx={{ width: 80, height: 80, border: '3px solid rgba(129,140,248,0.3)' }}
              />
              <Box>
                <Typography variant="h5" fontWeight={700} sx={{ color: '#FFFFFF' }}>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  {user?.email || 'No email'}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 2 }} />
            <Grid container spacing={2}>
              <Grid size={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748B', mb: 0.5 }}>
                  <GitHubIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption">GitHub ID</Typography>
                </Box>
                <Typography sx={{ color: '#FFFFFF' }}>{user?.githubId || '—'}</Typography>
              </Grid>
              <Grid size={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748B', mb: 0.5 }}>
                  <CalendarTodayIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption">Joined</Typography>
                </Box>
                <Typography sx={{ color: '#FFFFFF' }}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Row */}
      {statsLoading && !statsError ? (
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
          {[0, 1, 2].map((i) => (
            <Box key={i} sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <SkeletonCard lines={2} height={48} />
            </Box>
          ))}
        </Box>
      ) : statsError ? (
        <Box sx={{ mb: 3 }}>
          <ErrorDisplay message={statsError} onRetry={fetchData} />
        </Box>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
            {[
              {
                title: 'Reviews',
                value: statsData?.totalReviews || 0,
                icon: <RateReviewIcon />,
                color: '#818cf8',
                subtitle: statsData?.totalReviews > 0 ? `${statsData.totalReviews} completed` : 'No reviews yet',
              },
              {
                title: 'Rooms',
                value: roomsData?.length || 0,
                icon: <MeetingRoomIcon />,
                color: '#22d3ee',
                subtitle: roomsData?.length > 0 ? `${myRooms.length} owned, ${joinedRooms.length} joined` : 'No rooms yet',
              },
              {
                title: 'Collabs',
                value: statsData?.totalCollaborations || 0,
                icon: <GroupIcon />,
                color: '#22c55e',
                subtitle: statsData?.totalCollaborations > 0 ? `${statsData.totalCollaborations} rooms joined` : 'Join a room',
              },
            ].map((s) => (
              <Box key={s.title} sx={{ flex: '1 1 200px', minWidth: 0 }}>
                <StatCard {...s} />
              </Box>
            ))}
          </Box>
        </motion.div>
      )}

      {/* Recent Activity & Performance Row */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
        {/* Recent Rooms */}
        <Box sx={{ flex: '2 1 400px', minWidth: 0 }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.35 }}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#FFFFFF' }}>
                      Recent Rooms
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>
                      Your collaborative spaces
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    component={Link}
                    to="/rooms"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ color: '#818cf8', fontSize: 13 }}
                  >
                    View all
                  </Button>
                </Box>

                {roomsLoading ? (
                  <SkeletonText lines={4} />
                ) : roomsData?.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <MeetingRoomIcon sx={{ fontSize: 40, color: '#475569', mb: 1.5 }} />
                    <Typography variant="body2" sx={{ color: '#64748B' }}>
                      No rooms joined yet
                    </Typography>
                    <Button
                      component={Link}
                      to="/rooms"
                      variant="outlined"
                      size="small"
                      sx={{ mt: 2, borderRadius: 10 }}
                    >
                      Find Rooms
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {(roomsData || []).slice(0, 5).map((room) => (
                      <Box
                        key={room._id}
                        component={Link}
                        to={`/session/${room.roomId}`}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 1.5,
                          borderRadius: 2,
                          textDecoration: 'none',
                          border: '1px solid rgba(255,255,255,0.05)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.03)',
                            borderColor: 'rgba(129,140,248,0.15)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1.5,
                            bgcolor: 'rgba(129,140,248,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#818cf8',
                            fontWeight: 700,
                            fontSize: 13,
                            flexShrink: 0,
                          }}
                        >
                          {room.name?.[0]?.toUpperCase() || '#'}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#FFFFFF' }} noWrap>
                            {room.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748B' }}>
                            #{room.roomId}
                            {room.owner?._id === user?._id ? ' · Owner' : ' · Member'}
                          </Typography>
                        </Box>
                        <ArrowForwardIcon sx={{ color: '#475569', fontSize: 16 }} />
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Performance Snapshot */}
        <Box sx={{ flex: '1 1 260px', minWidth: 0 }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#FFFFFF', mb: 0.5 }}>
                  Performance
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                  Quality snapshot
                </Typography>

                {statsLoading ? (
                  <SkeletonText lines={3} />
                ) : !statsData || statsData.totalReviews === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <RateReviewIcon sx={{ fontSize: 40, color: '#475569', mb: 1.5 }} />
                    <Typography variant="body2" sx={{ color: '#64748B' }}>
                      Complete reviews to see scores
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap', gap: 2, py: 1 }}>
                    <CircularScore value={statsData.codeQualityScore || 0} color="#22c55e" label="Code Quality" size={90} strokeWidth={6} />
                    <CircularScore value={statsData.securityScore || 0} color="#f59e0b" label="Security" size={90} strokeWidth={6} />
                    <CircularScore value={statsData.codeQualityScore ? Math.round(statsData.codeQualityScore * 0.9) : 0} color="#818cf8" label="Maintainability" size={90} strokeWidth={6} />
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
