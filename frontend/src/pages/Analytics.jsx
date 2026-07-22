import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Box, LinearProgress, Button } from '@mui/material';
import { motion } from 'framer-motion';
import RateReviewIcon from '@mui/icons-material/RateReview';
import BugReportIcon from '@mui/icons-material/BugReport';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InsightsIcon from '@mui/icons-material/Insights';
import api from '../api/axios';
import StatCard from '../components/common/StatCard';
import CircularScore from '../components/common/CircularScore';
import { SkeletonCard, SkeletonChart, SkeletonText } from '../components/common/SkeletonLoader';
import ErrorDisplay from '../components/common/ErrorDisplay';
import EmptyState from '../components/common/EmptyState';

const MiniTrendChart = ({ data, color }) => {
  if (!data?.length || data.every(d => d.score === 0)) return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80, mt: 2 }}><Typography variant="body2" sx={{ color: '#64748B' }}>No data yet</Typography></Box>;
  const maxV = Math.max(...data.map(d => d.score)) || 100, minV = Math.min(...data.map(d => d.score)) || 0, range = maxV - minV || 1;
  const pts = data.map((d, i) => `${(i/(data.length-1))*100},${100-((d.score-minV)/range)*85}`).join(' ');
  const curr = data[data.length-1]?.score||0, start = data[0]?.score||0, change = curr - start;
  return (<Box sx={{ mt: 2 }}><Box sx={{ display:'flex',alignItems:'baseline',gap:1.5,mb:1.5 }}><Typography variant="h2" fontWeight={800} sx={{ color:'#FFFFFF',lineHeight:1,fontSize:44 }}>{curr}</Typography><Typography variant="body1" sx={{ color:'#64748B' }}>/100</Typography>{change!==0&&<Box sx={{ display:'flex',alignItems:'center',gap:0.5,color:change>0?'#22c55e':'#ef4444',ml:'auto' }}><Typography variant="body2" fontWeight={700}>{change>0?'↑':'↓'} {Math.abs(change)} pts</Typography><Typography variant="caption" sx={{ color:'#64748B' }}>since start</Typography></Box>}</Box><Box sx={{ width:'100%',height:90 }}><svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="tf2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.4"/><stop offset="100%" stopColor={color} stopOpacity="0.02"/></linearGradient></defs><polygon points={`0,100 ${pts} 100,100`} fill="url(#tf2)"/><polyline points={pts} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></Box><Box sx={{ display:'flex',justifyContent:'space-between',mt:0.75 }}>{data.map(d=><Typography key={d.week} variant="caption" sx={{ color:'#64748B',fontSize:10 }}>{d.week}</Typography>)}</Box></Box>);
};

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/analytics/stats');
      setStats(data);
    } catch {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (error) return <ErrorDisplay message={error} onRetry={fetchStats} fullPage />;

  if (loading) {
    return (
      <Box sx={{ display:'flex',flexDirection:'column',gap:3,p:{xs:2,md:4},maxWidth:1440,mx:'auto',width:'100%' }}>
        <Box>
          <SkeletonText lines={2} lineWidths={['30%', '45%']} />
        </Box>
        <Box sx={{ display:'flex',gap:3,flexWrap:'wrap' }}>
          {[0,1,2,3].map(i=><Box key={i} sx={{ flex:'1 1 220px',minWidth:0 }}><SkeletonCard lines={2} height={48}/></Box>)}
        </Box>
        <Box sx={{ display:'flex',gap:3,flexWrap:'wrap' }}>
          <Box sx={{ flex:'1.5 1 380px',minWidth:0 }}><SkeletonChart height={150}/></Box>
          <Box sx={{ flex:'1 1 260px',minWidth:0 }}><SkeletonCard lines={4} height={140}/></Box>
        </Box>
        <SkeletonCard lines={3} height={100} />
        <SkeletonCard lines={6} height={80} />
      </Box>
    );
  }

  if (stats && stats.totalReviews === 0) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1440, mx: 'auto', width: '100%' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h3" fontWeight={700} sx={{ color:'#FFFFFF',letterSpacing:'-0.03em' }}><InsightsIcon sx={{ mr:1.5,verticalAlign:'middle',fontSize:32 }}/> Analytics</Typography>
        </Box>
        <EmptyState
          icon={<InsightsIcon sx={{ fontSize: 36 }} />}
          title="No analytics yet"
          description="Complete code reviews to see your quality trends and performance metrics"
          action={
            <Button variant="contained" size="large" component={Link} to="/rooms" sx={{ borderRadius: 10, px: 4 }}>
              Find a Room
            </Button>
          }
        />
      </Box>
    );
  }

  const topStats = stats ? [{title:'Total Reviews',value:stats.totalReviews,icon:<RateReviewIcon/>,color:'#818cf8',subtitle:stats.totalReviews>0?`${stats.totalReviews} submissions analyzed`:'No reviews yet'},{title:'Bugs Found',value:stats.totalBugs,icon:<BugReportIcon/>,color:'#ef4444',subtitle:stats.totalBugs>0?`${stats.totalBugs} issues detected`:'No bugs found yet'},{title:'Avg Quality',value:stats.avgQualityScore>0?`${stats.avgQualityScore}%`:'--',icon:<TrendingUpIcon/>,color:'#22c55e',subtitle:stats.avgQualityScore>0?'Overall readability score':'No data yet'},{title:'Active Rooms',value:stats.activeRooms,icon:<InsightsIcon/>,color:'#22d3ee',subtitle:stats.activeRooms>0?`${stats.activeRooms} rooms you're in`:'Join a room'}] : [];
  const perf = stats ? [{value:stats.metrics?.codeQuality||0,color:'#22c55e',label:'Code Quality'},{value:stats.metrics?.security||0,color:'#f59e0b',label:'Security'},{value:stats.metrics?.maintainability||0,color:'#818cf8',label:'Maintainability'}] : [];
  const details = stats ? [{label:'Test Coverage',value:stats.metrics?.testCoverage||0,color:'#22c55e'},{label:'Documentation',value:stats.metrics?.documentation||0,color:'#f59e0b'},{label:'Linting',value:stats.metrics?.lintingCompliance||0,color:'#818cf8'},{label:'Response Time',value:stats.metrics?.responseTime||0,color:'#22d3ee'},{label:'Dependencies',value:stats.metrics?.dependencyHealth||0,color:'#a855f7'},{label:'Duplication',value:stats.metrics?.codeDuplication||0,color:'#ef4444',invert:true}] : [];
  const bugs = stats ? [{label:'Critical',count:stats.bugSeverity?.high||0,color:'#ef4444'},{label:'Medium',count:stats.bugSeverity?.medium||0,color:'#f59e0b'},{label:'Low',count:stats.bugSeverity?.low||0,color:'#818cf8'}] : [];
  const trend = stats?.trendData||[], hasData = stats && stats.totalReviews > 0;

  return (
    <Box sx={{ display:'flex',flexDirection:'column',gap:3,p:{xs:2,md:4},maxWidth:1440,mx:'auto',width:'100%' }}>
      <Box sx={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:2 }}>
        <Box><Typography variant="h3" fontWeight={700} sx={{ color:'#FFFFFF',letterSpacing:'-0.03em' }}><InsightsIcon sx={{ mr:1.5,verticalAlign:'middle',fontSize:32 }}/> Analytics</Typography><Typography variant="body2" sx={{ color:'#64748B',mt:0.5 }}>Comprehensive overview of your coding metrics</Typography></Box>
        {hasData&&<Typography variant="body2" sx={{ color:'#64748B',bgcolor:'rgba(255,255,255,0.03)',px:2.5,py:1,borderRadius:2 }}>{stats.totalReviews} reviews analyzed</Typography>}
      </Box>
      <Box sx={{ display:'flex',gap:3,flexWrap:'wrap' }}>{topStats.map(s=><Box key={s.title} sx={{ flex:'1 1 220px',minWidth:0 }}><StatCard {...s}/></Box>)}</Box>
      <Box sx={{ display:'flex',gap:3,flexWrap:'wrap' }}>
        <Box sx={{ flex:'1.5 1 380px',minWidth:0 }}><motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.3}}><Card sx={{ borderRadius:3,height:'100%' }}><CardContent sx={{ p:3 }}><Typography variant="h6" fontWeight={700} sx={{ color:'#FFFFFF' }}>Quality Trend</Typography><Typography variant="body2" sx={{ color:'#64748B' }}>Weekly score progression</Typography><MiniTrendChart data={trend} color="#818cf8"/></CardContent></Card></motion.div></Box>
        <Box sx={{ flex:'1 1 260px',minWidth:0 }}><motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.05,duration:0.3}}><Card sx={{ borderRadius:3,height:'100%' }}><CardContent sx={{ p:3 }}><Typography variant="h6" fontWeight={700} sx={{ color:'#FFFFFF',mb:0.5 }}>Bug Severity</Typography><Typography variant="body2" sx={{ color:'#64748B',mb:3 }}>Breakdown by priority</Typography>{bugs.every(b=>b.count===0)?<Box sx={{ py:6,textAlign:'center' }}><Typography variant="body1" sx={{ color:'#64748B' }}>No bugs found</Typography></Box>:bugs.map(b=>{const total=bugs.reduce((s,x)=>s+x.count,0),pct=total>0?Math.round((b.count/total)*100):0;return<Box key={b.label} sx={{ mb:3 }}><Box sx={{ display:'flex',justifyContent:'space-between',mb:1 }}><Typography variant="body1" sx={{ color:'#94A3B8',fontSize:14 }}>{b.label}</Typography><Box sx={{ display:'flex',alignItems:'center',gap:1.5 }}><Typography variant="body1" fontWeight={700} sx={{ color:b.color,fontSize:14 }}>{b.count}</Typography><Typography variant="body2" sx={{ color:'#64748B' }}>({pct}%)</Typography></Box></Box><LinearProgress variant="determinate" value={pct} sx={{ height:8 }}/></Box>;})}</CardContent></Card></motion.div></Box>
      </Box>
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1,duration:0.3}}><Card sx={{ borderRadius:3 }}><CardContent sx={{ p:3 }}><Typography variant="h6" fontWeight={700} sx={{ color:'#FFFFFF',mb:0.5 }}>Performance Scores</Typography><Typography variant="body2" sx={{ color:'#64748B',mb:3 }}>Key quality indicators</Typography><Box sx={{ display:'flex',justifyContent:'space-evenly',flexWrap:'wrap',gap:4,py:1 }}>{perf.map(s=><CircularScore key={s.label} {...s}/>)}</Box></CardContent></Card></motion.div>
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.15,duration:0.3}}><Card sx={{ borderRadius:3 }}><CardContent sx={{ p:3 }}><Typography variant="h6" fontWeight={700} sx={{ color:'#FFFFFF',mb:0.5 }}>Detailed Metrics</Typography><Typography variant="body2" sx={{ color:'#64748B',mb:3 }}>Comprehensive breakdown</Typography><Box sx={{ display:'flex',flexWrap:'wrap',gap:3 }}>{details.map(m=>{const dv=m.invert?100-m.value:m.value,level=dv>=80?'excellent':dv>=60?'good':dv>0?'needs work':'no data',lc=level==='excellent'?'#22c55e':level==='good'?'#f59e0b':level==='needs work'?'#ef4444':'#64748B';return<Box key={m.label} sx={{ flex:'1 1 280px',minWidth:0 }}><Box sx={{ display:'flex',justifyContent:'space-between',mb:1 }}><Typography variant="body1" sx={{ color:'#94A3B8',fontSize:14 }}>{m.label}</Typography><Box sx={{ display:'flex',alignItems:'center',gap:1.5 }}><Typography variant="body1" fontWeight={700} sx={{ color:m.color,fontSize:14 }}>{m.value>0?`${dv}%`:'--'}</Typography>{m.value>0&&<Typography variant="caption" sx={{ color:lc,textTransform:'capitalize',fontSize:11,bgcolor:`${lc}12`,px:1.5,py:0.5,borderRadius:2,fontWeight:600 }}>{level}</Typography>}</Box></Box><LinearProgress variant="determinate" value={dv} sx={{ height:6 }}/></Box>;})}</Box></CardContent></Card></motion.div>
    </Box>
  );
};

export default Analytics;
