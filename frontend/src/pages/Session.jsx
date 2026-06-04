import { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { CodeProvider, CodeContext } from '../context/CodeContext';
import useRoomSocket from '../hooks/useRoomSocket';
import api from '../api/axios';
import SessionBanner from '../components/rooms/SessionBanner';
import RightSidebar from '../components/layout/RightSidebar';
import CollaborativeEditor from '../components/editor/CollaborativeEditor';
import ChatWindow from '../components/chat/ChatWindow';
import ActiveUsersPanel from '../components/rooms/ActiveUsersPanel';
import AIChatPanel from '../components/ai/AIChatPanel';
import ReviewPanel from '../components/review/ReviewPanel';

const SessionInner = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('chat');
  const [reviewData, setReviewData] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [room, setRoom] = useState(null);
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

  // Keep ref in sync with latest code
  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await api.get(`/rooms/${id}`);
        setRoom(data.room);
      } catch {}
    };
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

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', bgcolor: '#0a0e17' }}>
      <SessionBanner room={room} participants={participants} onlineCount={onlineCount} />

      <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Editor column */}
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

        {/* Right sidebar with tabs */}
        <RightSidebar activeTab={activeTab} onTabChange={setActiveTab} onlineCount={onlineCount}>
          {TAB_CONTENT[activeTab]}
        </RightSidebar>
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
