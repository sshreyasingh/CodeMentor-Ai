import { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, SwipeableDrawer, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CodeProvider, CodeContext } from '../context/CodeContext';
import useRoomSocket from '../hooks/useRoomSocket';
import api from '../api/axios';
import SessionBanner from '../components/rooms/SessionBanner';
import RightSidebar from '../components/layout/RightSidebar';
import MobileTabBar from '../components/layout/MobileTabBar';
import CollaborativeEditor from '../components/editor/CollaborativeEditor';
import ChatWindow from '../components/chat/ChatWindow';
import ActiveUsersPanel from '../components/rooms/ActiveUsersPanel';
import AIChatPanel from '../components/ai/AIChatPanel';
import ReviewPanel from '../components/review/ReviewPanel';
import { SkeletonCard } from '../components/common/SkeletonLoader';
import ErrorDisplay from '../components/common/ErrorDisplay';

const SessionInner = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState('chat');
  const [reviewData, setReviewData] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [room, setRoom] = useState(null);
  const [roomLoading, setRoomLoading] = useState(true);
  const [roomError, setRoomError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);
  const {
    participants,
    onlineCount,
    systemMessages,
    lastEditor,
    myColor,
    remoteCursors,
    emitCodeChange,
    emitLanguageChange,
    emitCursorMove,
    emitCursorSelection,
  } = useRoomSocket(id);
  const { code, language } = useContext(CodeContext);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  const fetchRoom = async () => {
    setRoomLoading(true);
    setRoomError('');
    try {
      const { data } = await api.get(`/rooms/${id}`);
      setRoom(data.room);
    } catch (err) {
      setRoomError(err.response?.data?.message || 'Failed to load room');
    } finally {
      setRoomLoading(false);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const handleReview = async () => {
    const currentCode = codeRef.current;
    if (!currentCode || currentCode === '// Start coding...\n') return;
    setActiveTab('review');
    setReviewLoading(true);
    setReviewData(null);
    try {
      const { data } = await api.post('/review', { code: currentCode, language });
      setReviewData(data);
    } catch (err) {
      setReviewData({ complexity: { error: err.response?.data?.message || 'Review failed' } });
    } finally {
      setReviewLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (!isMobile) return;
    setDrawerOpen(true);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/join/${id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TAB_CONTENT = {
    chat: (
      <ChatWindow
        roomId={id}
        roomName={room?.name}
        participants={participants}
        onlineCount={onlineCount}
        systemMessages={systemMessages}
      />
    ),
    users: (
      <ActiveUsersPanel
        participants={participants}
        onlineCount={onlineCount}
        myColor={myColor}
        embedded
      />
    ),
    ai: <AIChatPanel code={code} language={language} />,
    review: <ReviewPanel review={reviewData} loading={reviewLoading} />,
  };

  if (roomLoading) {
    return (
      <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', bgcolor: '#0a0e17' }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SkeletonCard lines={1} height={28} />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
          <Box sx={{ flex: 1, minWidth: 0, p: 1.5 }}>
            <SkeletonCard lines={6} height="80%" />
          </Box>
          {!isMobile && (
            <Box sx={{ width: 380, minWidth: 380, p: 2, borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
              <SkeletonCard lines={8} height="100%" />
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  if (roomError) {
    return (
      <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', bgcolor: '#0a0e17' }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ErrorDisplay message={roomError} onRetry={fetchRoom} />
        </Box>
      </Box>
    );
  }

  const isNewRoom = room && participants.length <= 1 && code === '// Start coding...\n';

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', bgcolor: '#0a0e17' }}>
      <SessionBanner room={room} participants={participants} onlineCount={onlineCount} />

      {isNewRoom && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Box
            sx={{
              mx: 2,
              mt: 1.5,
              p: 2.5,
              borderRadius: 3,
              bgcolor: 'rgba(129,140,248,0.06)',
              border: '1px solid rgba(129,140,248,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="body1" fontWeight={600} sx={{ color: '#FFFFFF' }}>
                Welcome to {room?.name || 'the room'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.25 }}>
                Share the invite link to start collaborating
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyLink}
              sx={{ borderRadius: 10 }}
            >
              {copied ? 'Copied!' : 'Copy Invite Link'}
            </Button>
          </Box>
        </motion.div>
      )}

      <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <Box sx={{ flex: 1, minWidth: 0, p: 1.5, display: 'flex', flexDirection: 'column' }}>
          <CollaborativeEditor
            roomId={id}
            onReview={handleReview}
            reviewLoading={reviewLoading}
            emitCodeChange={emitCodeChange}
            emitLanguageChange={emitLanguageChange}
            emitCursorMove={emitCursorMove}
            emitCursorSelection={emitCursorSelection}
            lastEditor={lastEditor}
            participants={participants}
            myColor={myColor}
            remoteCursors={remoteCursors}
          />
        </Box>

        {isMobile ? (
          <>
            <MobileTabBar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onlineCount={onlineCount}
            />
            <SwipeableDrawer
              anchor="bottom"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              onOpen={() => setDrawerOpen(true)}
              disableSwipeToOpen={false}
              PaperProps={{
                sx: {
                  height: '70vh',
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  bgcolor: '#111827',
                  backgroundImage: 'none',
                },
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 4,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.15)',
                  mx: 'auto',
                  mt: 1.5,
                  mb: 1,
                }}
              />
              <Box sx={{ flex: 1, overflow: 'hidden', height: 'calc(70vh - 32px)' }}>
                {TAB_CONTENT[activeTab]}
              </Box>
            </SwipeableDrawer>
          </>
        ) : (
          <RightSidebar activeTab={activeTab} onTabChange={setActiveTab} onlineCount={onlineCount}>
            {TAB_CONTENT[activeTab]}
          </RightSidebar>
        )}
      </Box>
    </Box>
  );
};

const Session = () => (
  <CodeProvider>
    <SessionInner />
  </CodeProvider>
);

export default Session;
