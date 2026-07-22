import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Chip, LinearProgress, Button, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import api from '../api/axios';
import { SkeletonCard, SkeletonText } from '../components/common/SkeletonLoader';

const SC = { high:'#ef4444', medium:'#f59e0b', low:'#818cf8' };
const SL = { high:'High Priority', medium:'Medium Priority', low:'Low Priority' };
const CL = { nested_loops:'Nested Loops', variable_naming:'Variable Naming', null_checks:'Null Checks', error_handling:'Error Handling', type_safety:'Type Safety', performance:'Performance', security:'Security', documentation:'Documentation', code_duplication:'Code Duplication', complexity:'Complexity' };

const Insights = () => {
  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const fetch = async () => { setLoading(true);setError('');try { const { data: r } = await api.get('/insights');setData(r); } catch(e) { setError(e.response?.data?.message||'Failed'); } finally { setLoading(false); } };
  useEffect(() => { fetch(); }, []);
  if(loading) return (
    <Box sx={{ display:'flex',flexDirection:'column',gap:3,p:{xs:2,md:4},maxWidth:1440,mx:'auto',width:'100%' }}>
      <Box><SkeletonText lines={2} lineWidths={['30%','45%']}/></Box>
      <Box sx={{ display:'flex',gap:3,flexWrap:'wrap' }}>
        <Box sx={{ flex:'1 1 240px',minWidth:0 }}><SkeletonCard lines={2} height={80}/></Box>
        <Box sx={{ flex:'2 1 500px',minWidth:0 }}><SkeletonCard lines={4} height={120}/></Box>
      </Box>
      <SkeletonText lines={1} lineWidths={['25%']}/>
      <Box sx={{ display:'flex',flexWrap:'wrap',gap:3 }}>
        {[0,1,2].map(i=><Box key={i} sx={{ flex:'1 1 320px',minWidth:0 }}><SkeletonCard lines={3} height={100}/></Box>)}
      </Box>
    </Box>
  );
  if(error) return <Box sx={{ p:4 }}><Alert severity="error" action={<Button onClick={fetch}>Retry</Button>}>{error}</Alert></Box>;
  if(!data || data.totalReviews===0) return <Box sx={{ textAlign:'center',py:16 }}><LightbulbIcon sx={{ fontSize:72,color:'#475569',mb:3 }}/><Typography variant="h4" fontWeight={700} sx={{ color:'#94A3B8',mb:1 }}>No Insights Yet</Typography><Typography variant="body1" sx={{ color:'#64748B',maxWidth:500,mx:'auto' }}>Run code reviews to get personalized learning insights.</Typography></Box>;

  const patterns = data.recurringPatterns || [];
  const hc = patterns.filter(p=>p.severity==='high').length, mc = patterns.filter(p=>p.severity==='medium').length, lc = patterns.filter(p=>p.severity==='low').length, total = hc+mc+lc;

  return (
    <Box sx={{ display:'flex',flexDirection:'column',gap:3,p:{xs:2,md:4},maxWidth:1440,mx:'auto',width:'100%' }}>
      <Box sx={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:2 }}>
        <Box><Typography variant="h3" fontWeight={700} sx={{ color:'#FFFFFF',letterSpacing:'-0.03em' }}><EmojiObjectsIcon sx={{ mr:1.5,verticalAlign:'middle',fontSize:32 }}/> Learning Insights</Typography><Typography variant="body2" sx={{ color:'#64748B',mt:0.5 }}>Personalized recommendations based on your code patterns</Typography></Box>
        <Button variant="outlined" size="large" startIcon={<AutoAwesomeIcon/>} onClick={fetch} sx={{ py:1.25,px:3,borderRadius:10 }}>Refresh</Button>
      </Box>

      {data.aiSummary && <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.3}}><Card sx={{ border:'1px solid rgba(129,140,248,0.2)',bgcolor:'rgba(129,140,248,0.06)',borderRadius:3 }}><CardContent sx={{ p:3 }}><Box sx={{ display:'flex',gap:2,alignItems:'flex-start' }}><AutoAwesomeIcon sx={{ color:'#22d3ee',mt:0.3,fontSize:22 }}/><Box><Typography variant="h6" fontWeight={700} sx={{ color:'#FFFFFF',mb:1 }}>AI-Powered Summary</Typography><Typography variant="body1" sx={{ color:'#94A3B8',lineHeight:1.8,fontSize:15 }}>{data.aiSummary}</Typography></Box></Box></CardContent></Card></motion.div>}

      <Box sx={{ display:'flex',gap:3,flexWrap:'wrap' }}>
        <Box sx={{ flex:'1 1 240px',minWidth:0 }}>
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.3}}>
            <Card sx={{ height:'100%',textAlign:'center',borderRadius:3 }}><CardContent sx={{ p:3 }}><Typography variant="body1" sx={{ color:'#64748B',mb:1 }}>Improvement Score</Typography><Typography variant="h1" fontWeight={800} sx={{ color:'#818cf8',mb:2,fontSize:64 }}>{data.improvementScore}</Typography><LinearProgress variant="determinate" value={data.improvementScore} sx={{ height:8,mb:1 }}/><Typography variant="body2" sx={{ color:'#64748B' }}>Based on {data.totalReviews} reviews</Typography></CardContent></Card>
          </motion.div>
        </Box>
        <Box sx={{ flex:'2 1 500px',minWidth:0 }}>
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.05,duration:0.3}}>
            <Card sx={{ height:'100%',borderRadius:3 }}><CardContent sx={{ p:3 }}><Typography variant="h6" fontWeight={700} sx={{ color:'#FFFFFF',mb:0.5 }}><TrendingUpIcon sx={{ mr:0.5,verticalAlign:'middle',color:'#22c55e',fontSize:18 }}/> Strengths &amp; Areas</Typography><Typography variant="body2" sx={{ color:'#64748B',mb:3 }}>What you excel at and where you can improve</Typography>
            <Typography variant="body1" fontWeight={600} sx={{ color:'#94A3B8',mb:1 }}>Strengths</Typography>{data.strengths?.length>0?<Box sx={{ display:'flex',flexWrap:'wrap',gap:1,mb:3 }}>{data.strengths.map((s,i)=><Chip key={i} label={s} color="success" variant="outlined" size="medium"/>)}</Box>:<Typography variant="body2" sx={{ color:'#64748B',mb:3 }}>Complete more reviews to identify your strengths.</Typography>}
            <Typography variant="body1" fontWeight={600} sx={{ color:'#94A3B8',mb:1 }}>Issue Severity</Typography><Box sx={{ display:'flex',gap:2.5 }}>{[{count:hc,color:'#ef4444',label:'High',bg:'#ef4444'},{count:mc,color:'#f59e0b',label:'Medium',bg:'#f59e0b'},{count:lc,color:'#818cf8',label:'Low',bg:'#818cf8'}].map(s=>{const pct=total>0?Math.round((s.count/total)*100):0;return<Box key={s.label} sx={{ flex:1,textAlign:'center',p:2,borderRadius:2,bgcolor:`${s.bg}08`,border:`1px solid ${s.bg}14` }}><Typography variant="h4" fontWeight={800} sx={{ color:s.color,lineHeight:1,fontSize:28 }}>{s.count}</Typography><Typography variant="body2" fontWeight={600} sx={{ color:s.color,mt:0.5 }}>{s.label}</Typography>{total>0&&<Typography variant="caption" sx={{ color:'#64748B',mt:0.25,display:'block' }}>{pct}%</Typography>}</Box>;})}</Box></CardContent></Card>
          </motion.div>
        </Box>
      </Box>

      <Box sx={{ mt:1 }}><Typography variant="h5" fontWeight={700} sx={{ color:'#FFFFFF' }}><WarningIcon sx={{ mr:0.75,verticalAlign:'middle',color:'#f59e0b',fontSize:20 }}/> Recurring Patterns</Typography><Typography variant="body2" sx={{ color:'#64748B',mt:0.5 }}>Patterns found across your code reviews</Typography></Box>

      <Box sx={{ display:'flex',flexWrap:'wrap',gap:3 }}>
        {patterns.map((p,i)=><Box key={p.category} sx={{ flex:'1 1 320px',minWidth:0 }}>
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.06,duration:0.25}}>
            <Card sx={{ borderLeft:3,borderColor:SC[p.severity],height:'100%',borderRadius:3 }}><CardContent sx={{ p:3 }}><Box sx={{ display:'flex',justifyContent:'space-between',mb:2 }}><Chip label={CL[p.category]||p.label} size="small" color="secondary"/><Chip label={`${p.count}x`} size="small" sx={{ bgcolor:`${SC[p.severity]}14`,color:SC[p.severity],fontWeight:700 }}/></Box><Typography variant="h6" fontWeight={600} sx={{ color:'#FFFFFF',mb:0.75 }}>{p.label}</Typography><Chip label={SL[p.severity]} size="small" sx={{ bgcolor:`${SC[p.severity]}14`,color:SC[p.severity],mb:2 }}/><Typography variant="body1" sx={{ color:'#94A3B8',lineHeight:1.7,fontSize:14 }}>{p.recommendation}</Typography></CardContent></Card>
          </motion.div>
        </Box>)}
      </Box>
    </Box>
  );
};

export default Insights;
