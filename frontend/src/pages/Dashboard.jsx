import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import GroupIcon from '@mui/icons-material/Group';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import StatCard from '../components/common/StatCard';
import ScoreCard from '../components/common/ScoreCard';
import CircularScore from '../components/common/CircularScore';
import WelcomeUser from '../components/dashboard/WelcomeUser';
import RecentRooms from '../components/dashboard/RecentRooms';
import { SkeletonCard, SkeletonText } from '../components/common/SkeletonLoader';
import ErrorDisplay from '../components/common/ErrorDisplay';
import EmptyState from '../components/common/EmptyState';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/analytics/dashboard');
      setStats(data);
    } catch {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const redirect = sessionStorage.getItem('loginRedirect');
    if (redirect) {
      sessionStorage.removeItem('loginRedirect');
      navigate(redirect, { replace: true });
      return;
    }
    fetchDashboard();
  }, [fetchDashboard, navigate]);

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchDashboard} fullPage />;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: { xs: 2, md: 4 }, maxWidth: 1440, mx: 'auto', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SkeletonCard lines={0} height={48} width={48} />
          <Box sx={{ flex: 1 }}>
            <SkeletonText lines={2} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {[0, 1, 2, 3].map((i) => (
            <Box key={i} sx={{ flex: '1 1 220px', minWidth: 0 }}>
              <SkeletonCard lines={2} height={48} />
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '3 1 500px', minWidth: 0 }}>
            <SkeletonCard lines={3} height={120} />
          </Box>
          <Box sx={{ flex: '1 1 260px', minWidth: 0 }}>
            <SkeletonCard lines={5} height={160} />
          </Box>
        </Box>
      </Box>
    );
  }

  const isEmpty = stats && stats.totalReviews === 0 && stats.totalCollaborations === 0;

  if (isEmpty) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1440, mx: 'auto', width: '100%' }}>
        <WelcomeUser user={user} stats={stats} />
        <EmptyState
          icon={<CodeIcon sx={{ fontSize: 36 }} />}
          title="No activity yet"
          description="Create or join a room to start getting code reviews and analytics"
          action={
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/rooms"
              startIcon={<AddIcon />}
              sx={{ borderRadius: 10, px: 4 }}
            >
              Get Started
            </Button>
          }
        />
      </Box>
    );
  }

  const dStats = stats
    ? [
        { title: 'Total Reviews', value: stats.totalReviews, icon: <RateReviewIcon />, color: '#818cf8', subtitle: stats.totalReviews > 0 ? `${stats.totalReviews} reviews completed` : 'No reviews yet' },
        { title: 'Collaborations', value: stats.totalCollaborations, icon: <GroupIcon />, color: '#22d3ee', subtitle: stats.totalCollaborations > 0 ? `${stats.totalCollaborations} rooms joined` : 'Join a room' },
        { title: 'Code Quality', value: stats.codeQualityScore > 0 ? `${stats.codeQualityScore}%` : '--', icon: <CodeIcon />, color: '#22c55e', subtitle: stats.codeQualityScore > 0 ? 'Overall review score' : 'Run a review' },
        { title: 'Security', value: stats.securityScore > 0 ? `${stats.securityScore}%` : '--', icon: <SecurityIcon />, color: '#f59e0b', subtitle: stats.securityScore > 0 ? 'Fewer issues = higher' : 'Analyze for issues' },
      ]
    : [];

  const perfScores = stats
    ? [
        { label: 'Code Quality', score: stats.codeQualityScore, color: '#22c55e' },
        { label: 'Security', score: stats.securityScore, color: '#f59e0b' },
        { label: 'Documentation', score: stats.codeQualityScore > 0 ? Math.round(stats.codeQualityScore * 0.85) : 0, color: '#818cf8' },
        { label: 'Test Coverage', score: stats.codeQualityScore > 0 ? Math.round(stats.codeQualityScore * 0.9) : 0, color: '#22d3ee' },
        { label: 'Maintainability', score: stats.codeQualityScore > 0 ? Math.min(100, stats.codeQualityScore + 5) : 0, color: '#a855f7' },
      ]
    : [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: { xs: 2, md: 4 }, maxWidth: 1440, mx: 'auto', width: '100%' }}>
      <WelcomeUser user={user} stats={stats} />
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {dStats.map((s) => (
          <Box key={s.title} sx={{ flex: '1 1 220px', minWidth: 0 }}>
            <StatCard {...s} />
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '3 1 500px', minWidth: 0 }}>
          <RecentRooms rooms={stats?.recentRooms || []} />
        </Box>
        <Box sx={{ flex: '1 1 260px', minWidth: 0 }}>
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.3 }}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#FFFFFF', mb: 0.5 }}>
                  Performance
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                  Score breakdown
                </Typography>
                {perfScores.map((score) => (
                  <ScoreCard key={score.label} {...score} />
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 240px', minWidth: 0 }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.3 }}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#FFFFFF', mb: 0.5 }}>
                  Quick Actions
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                  Jump right back in
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Button fullWidth variant="contained" size="large" startIcon={<AddIcon />} onClick={() => navigate('/rooms')} sx={{ py: 1.5, fontSize: 15 }}>
                    Create a Room
                  </Button>
                  <Button fullWidth variant="outlined" size="large" startIcon={<EmojiObjectsIcon />} onClick={() => navigate('/insights')} sx={{ py: 1.5, fontSize: 15 }}>
                    View Insights
                  </Button>
                  <Button fullWidth variant="outlined" size="large" startIcon={<TrendingUpIcon />} onClick={() => navigate('/analytics')} sx={{ py: 1.5, fontSize: 15 }}>
                    Analytics
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
        <Box sx={{ flex: '3 1 500px', minWidth: 0 }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.3 }}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#FFFFFF' }}>
                      At a Glance
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>
                      Your review metrics
                    </Typography>
                  </Box>
                  <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/analytics')} sx={{ color: '#818cf8', fontSize: 13 }}>
                    Full report
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexWrap: 'wrap', py: 2 }}>
                  <CircularScore value={stats?.codeQualityScore || 0} color="#22c55e" label="Code Quality" />
                  <CircularScore value={stats?.securityScore || 0} color="#f59e0b" label="Security" />
                  <CircularScore value={stats?.codeQualityScore ? Math.round(stats.codeQualityScore * 0.9) : 0} color="#818cf8" label="Maintainability" />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
