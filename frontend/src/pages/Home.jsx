import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import BoltIcon from '@mui/icons-material/Bolt';
import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAuth } from '../hooks/useAuth';

const FEATURES = [
  {
    icon: <CodeIcon sx={{ fontSize: 26 }} />,
    label: 'Real-Time Editor',
    desc: 'Multi-cursor editing with instant sync and live presence. See every keystroke as it happens.',
    color: '#818cf8',
  },
  {
    icon: <BoltIcon sx={{ fontSize: 26 }} />,
    label: 'AI Code Reviews',
    desc: 'DeepSeek R1 analyzes your code for bugs, security issues, optimizations, and best practices.',
    color: '#22d3ee',
  },
  {
    icon: <GroupIcon sx={{ fontSize: 26 }} />,
    label: 'Team Rooms',
    desc: 'Create shared coding spaces, invite by link, and pair program with built-in chat and voice-ready.',
    color: '#22c55e',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 26 }} />,
    label: 'Security Insights',
    desc: 'Automated vulnerability detection with severity scoring across every code review.',
    color: '#f59e0b',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 26 }} />,
    label: 'Live Execution',
    desc: 'Run JavaScript, Python, Java, C++, Go and more directly in your browser with instant output.',
    color: '#a855f7',
  },
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 26 }} />,
    label: 'AI Assistant',
    desc: 'Chat with an AI mentor that sees your code context. Debug, refactor, and learn in real time.',
    color: '#ec4899',
  },
];

const STATS = [
  { value: '5+', label: 'Languages', color: '#818cf8' },
  { value: 'Real-Time', label: 'Sync', color: '#22d3ee' },
  { value: 'AI', label: 'Powered', color: '#a855f7' },
  { value: '24/7', label: 'Available', color: '#22c55e' },
];

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.5 ? '129,140,248' : '34,211,238',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.15, 0,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.6
      );
      gradient.addColorStop(0, 'rgba(129,140,248,0.04)');
      gradient.addColorStop(0.5, 'rgba(34,211,238,0.02)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},${p.opacity})`;
        ctx.fill();

        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${p.hue},${0.04 * (1 - dist / 100)})`;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  );
};

const CodeWindow = () => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.97 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
  >
    <Box
      sx={{
        maxWidth: 700,
        mx: 'auto',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(129,140,248,0.08)',
        bgcolor: '#0d1117',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1.5,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          bgcolor: '#0B1120',
        }}
      >
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ef4444' }} />
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#f59e0b' }} />
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#22c55e' }} />
        <Typography variant="caption" sx={{ color: '#64748B', ml: 1, fontSize: 11 }}>
          main.tsx — CodeMentor
        </Typography>
      </Box>
      <Box sx={{ p: 2.5, fontFamily: '"Fira Code", "JetBrains Mono", monospace', fontSize: 13, lineHeight: 1.8 }}>
        <Box sx={{ color: '#8b949e' }}>
          <span style={{ color: '#ff7b72' }}>import</span> {'{ Box, Typography, Button }'} <span style={{ color: '#ff7b72' }}>from</span>{' '}
          <span style={{ color: '#a5d6ff' }}>'@mui/material'</span>;
        </Box>
        <Box sx={{ color: '#8b949e' }}>
          <span style={{ color: '#ff7b72' }}>import</span> {'{ useState }'} <span style={{ color: '#ff7b72' }}>from</span>{' '}
          <span style={{ color: '#a5d6ff' }}>'react'</span>;
        </Box>
        <Box sx={{ height: 8 }} />
        <Box sx={{ color: '#8b949e' }}>
          <span style={{ color: '#ff7b72' }}>const</span>{' '}
          <span style={{ color: '#d2a8ff' }}>CodeMentor</span> = () =&gt; {'{'}
        </Box>
        <Box sx={{ color: '#8b949e', pl: 2 }}>
          <span style={{ color: '#ff7b72' }}>const</span> [<span style={{ color: '#79c0ff' }}>collaborating</span>,{' '}
          <span style={{ color: '#79c0ff' }}>setCollaborating</span>] = <span style={{ color: '#d2a8ff' }}>useState</span>(
          <span style={{ color: '#79c0ff' }}>true</span>);
        </Box>
        <Box sx={{ height: 4 }} />
        <Box sx={{ color: '#8b949e', pl: 2 }}>
          <span style={{ color: '#ff7b72' }}>return</span> (
        </Box>
        <Box sx={{ color: '#8b949e', pl: 4 }}>
          &lt;<span style={{ color: '#7ee787' }}>CollaborativeEditor</span>
        </Box>
        <Box sx={{ color: '#8b949e', pl: 6 }}>
          <span style={{ color: '#79c0ff' }}>language</span>=
          {'{'}
          <span style={{ color: '#a5d6ff' }}>"typescript"</span>
          {'}'}
        </Box>
        <Box sx={{ color: '#8b949e', pl: 6 }}>
          <span style={{ color: '#79c0ff' }}>aiReview</span>={'{'}
          <span style={{ color: '#79c0ff' }}>true</span>
          {'}'}
        </Box>
        <Box sx={{ color: '#8b949e', pl: 6 }}>
          <span style={{ color: '#79c0ff' }}>liveCursors</span>={'{'}
          <span style={{ color: '#79c0ff' }}>true</span>
          {'}'}
        </Box>
        <Box sx={{ color: '#8b949e', pl: 4 }}>
          /&gt;
        </Box>
        <Box sx={{ color: '#8b949e', pl: 2 }}>);</Box>
        <Box sx={{ color: '#8b949e' }}>{'}'}</Box>
        <Box sx={{ height: 8 }} />
        <Box sx={{ color: '#64748B', fontSize: 12 }}>
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            ▮
          </motion.span>{' '}
          Live collaboration active
        </Box>
      </Box>
    </Box>
  </motion.div>
);

const FeatureCard = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08, duration: 0.45, ease: [0.25, 0.4, 0.25, 1] }}
    style={{ height: '100%' }}
  >
    <Box
      sx={{
        p: 3,
        height: '100%',
        borderRadius: 3,
        bgcolor: 'rgba(12,18,35,0.6)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          bgcolor: 'rgba(12,18,35,0.85)',
          borderColor: `rgba(${parseInt(feature.color.slice(1, 3), 16)}, ${parseInt(feature.color.slice(3, 5), 16)}, ${parseInt(feature.color.slice(5, 7), 16)}, 0.2)`,
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(${parseInt(feature.color.slice(1, 3), 16)}, ${parseInt(feature.color.slice(3, 5), 16)}, ${parseInt(feature.color.slice(5, 7), 16)}, 0.06)`,
        },
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 1.5,
          background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}08)`,
          border: `1px solid ${feature.color}20`,
          color: feature.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
        }}
      >
        {feature.icon}
      </Box>
      <Typography variant="h6" fontWeight={700} sx={{ color: '#FFFFFF', mb: 1, fontSize: 16 }}>
        {feature.label}
      </Typography>
      <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6, fontSize: 13 }}>
        {feature.desc}
      </Typography>
    </Box>
  </motion.div>
);

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const ref = useRef(null);

  return (
    <Box ref={ref} sx={{ position: 'relative', overflow: 'hidden' }}>
      <AnimatedBackground />

      {/* ── Hero Section ── */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: '95vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 3,
          pb: { xs: 8, md: 10 },
        }}
      >
        {/* Colored glow orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: '5%',
            left: '40%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(129,140,248,0.15) 0%, transparent 60%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 55%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            left: '15%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 55%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}>
          {/* Badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2.5,
              py: 1,
              borderRadius: 10,
              bgcolor: 'rgba(129,140,248,0.08)',
              border: '1px solid rgba(129,140,248,0.15)',
              mb: 5,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#22c55e',
                boxShadow: '0 0 10px rgba(34,197,94,0.5)',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.4 },
                },
              }}
            />
            <Typography variant="caption" fontWeight={600} sx={{ color: '#a5b4fc', letterSpacing: 2, fontSize: 11 }}>
              COLLABORATIVE CODING REDEFINED
            </Typography>
          </Box>

          {/* Headline */}
          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 36, sm: 52, md: 72 },
                lineHeight: 1.08,
                mb: 3,
                fontWeight: 800,
                letterSpacing: '-0.03em',
              }}
            >
              <Box component="span" sx={{ color: '#FFFFFF' }}>
                Code together.
              </Box>
              <br />
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #a5b4fc 0%, #67e8f9 40%, #c084fc 70%, #f472b6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% 200%',
                  animation: 'shimmer 4s ease-in-out infinite',
                  '@keyframes shimmer': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                  },
                }}
              >
                Ship faster.
              </Box>
            </Typography>
          </Box>

          {/* Subtitle */}
          <Typography
            variant="h6"
            sx={{
              color: '#94A3B8',
              maxWidth: 580,
              mx: 'auto',
              mb: 6,
              lineHeight: 1.7,
              fontWeight: 400,
              fontSize: { xs: 15, md: 17 },
            }}
          >
            A collaborative code editor with live cursors, AI-powered reviews, and real-time chat.
            Built for teams that move fast.
          </Typography>

          {/* CTA */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 8 }}>
            {isAuthenticated ? (
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/dashboard')}
                sx={{
                  px: 5,
                  py: 1.75,
                  fontSize: 16,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                  boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                  '&:hover': {
                    boxShadow: '0 6px 28px rgba(99,102,241,0.55)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Open Dashboard
              </Button>
            ) : (
              <Button
                variant="outlined"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/login')}
                sx={{ px: 5, py: 1.75, fontSize: 16, borderRadius: 12 }}
              >
                Learn More
              </Button>
            )}
          </Box>

          {/* Stats row */}
          <Box sx={{ display: 'flex', gap: { xs: 4, md: 10 }, justifyContent: 'center', flexWrap: 'wrap' }}>
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
              >
                <Typography
                  variant="h3"
                  fontWeight={800}
                  sx={{
                    color: stat.color,
                    fontSize: { xs: 28, md: 32 },
                    mb: 0.5,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', fontSize: 13 }}>
                  {stat.label}
                </Typography>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Box>

      {/* ── Code Preview Section ── */}
      <Box sx={{ position: 'relative', zIndex: 1, px: 3, pb: 10, pt: 4 }}>
        {/* Section accent blobs */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '-10%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 60%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            right: '-5%',
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 60%)',
            filter: 'blur(35px)',
            pointerEvents: 'none',
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            sx={{
              color: '#FFFFFF',
              mb: 2,
              fontSize: { xs: 24, md: 32 },
              letterSpacing: '-0.02em',
            }}
          >
            Write code. Get feedback. Iterate.
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ color: '#64748B', mb: 6, maxWidth: 500, mx: 'auto', lineHeight: 1.6 }}
          >
            Real-time collaboration meets AI-powered analysis in one seamless editor.
          </Typography>
        </motion.div>
        <CodeWindow />
      </Box>

      {/* ── Features Grid Section ── */}
      <Box sx={{ position: 'relative', zIndex: 1, pb: 10, pt: 4 }}>
        {/* Section accent blobs */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '20%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 60%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '5%',
            right: '10%',
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 55%)',
            filter: 'blur(45px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Section badge */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.5,
                  borderRadius: 8,
                  bgcolor: 'rgba(34,211,238,0.08)',
                  border: '1px solid rgba(34,211,238,0.15)',
                  mb: 3,
                }}
              >
                <BoltIcon sx={{ fontSize: 14, color: '#22d3ee' }} />
                <Typography variant="caption" fontWeight={600} sx={{ color: '#67e8f9', fontSize: 11, letterSpacing: 1 }}>
                  POWERED BY DEEPSEEK R1
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="h4"
              fontWeight={700}
              textAlign="center"
              sx={{
                color: '#FFFFFF',
                mb: 2,
                fontSize: { xs: 24, md: 32 },
                letterSpacing: '-0.02em',
              }}
            >
              Everything you need to code better
            </Typography>
            <Typography
              variant="body1"
              textAlign="center"
              sx={{ color: '#64748B', mb: 8, maxWidth: 520, mx: 'auto', lineHeight: 1.6 }}
            >
              From live editing to AI reviews — all the tools modern teams need in one place.
            </Typography>
          </motion.div>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
              gap: 3,
            }}
          >
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.label} feature={f} index={i} />
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Bottom CTA Section ── */}
      <Box sx={{ position: 'relative', zIndex: 1, pb: 12, pt: 4 }}>
        {/* Ambient glows */}
        <Box
          sx={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            width: 600,
            height: 400,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(129,140,248,0.1) 0%, rgba(34,211,238,0.04) 40%, transparent 65%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <Box
              sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                textAlign: 'center',
                bgcolor: 'rgba(12,18,35,0.7)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(129,140,248,0.12)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(129,140,248,0.08) 0%, transparent 60%)',
                  pointerEvents: 'none',
                }}
              />
              {/* Decorative top bar */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 120,
                  height: 3,
                  borderRadius: '0 0 3px 3px',
                  background: 'linear-gradient(90deg, #818cf8, #22d3ee, #a855f7)',
                }}
              />
              <Typography
                variant="h3"
                fontWeight={700}
                sx={{
                  color: '#FFFFFF',
                  mb: 2,
                  fontSize: { xs: 24, md: 36 },
                  letterSpacing: '-0.02em',
                  position: 'relative',
                }}
              >
                Ready to build together?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#94A3B8',
                  mb: 4,
                  maxWidth: 460,
                  mx: 'auto',
                  lineHeight: 1.6,
                  position: 'relative',
                }}
              >
                Join developers who are already using CodeMentor to collaborate, review, and ship better code.
              </Typography>
              <Box sx={{ position: 'relative', display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                {isAuthenticated ? (
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      px: 5,
                      py: 1.75,
                      fontSize: 16,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                    }}
                  >
                    Open Dashboard
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/login')}
                    sx={{ px: 4, py: 1.75, fontSize: 16, borderRadius: 12 }}
                  >
                    Learn More
                  </Button>
                )}
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
