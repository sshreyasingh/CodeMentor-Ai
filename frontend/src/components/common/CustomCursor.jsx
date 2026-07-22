import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let rafId;

    const onMove = (e) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    };

    const isClickable = (el) => {
      if (!el) return false;
      const tag = el.tagName?.toLowerCase();
      if (['a', 'button', 'select'].includes(tag)) return true;
      if (tag === 'input' && !['text', 'textarea'].includes(el.type)) return true;
      if (el.getAttribute('role') === 'button') return true;
      if (el.closest?.('.MuiTab-root, .MuiListItemButton-root, .MuiIconButton-root, .MuiChip-root, [role="button"]')) return true;
      return false;
    };

    const onOver = (e) => {
      const el = e.target;
      if (isClickable(el) && ringRef.current) {
        ringRef.current.style.width = '40px';
        ringRef.current.style.height = '40px';
        ringRef.current.style.borderColor = 'rgba(129,140,248,0.4)';
        ringRef.current.style.backgroundColor = 'rgba(129,140,248,0.1)';
      }
    };

    const onOut = (e) => {
      if (ringRef.current) {
        ringRef.current.style.width = '28px';
        ringRef.current.style.height = '28px';
        ringRef.current.style.borderColor = 'rgba(129,140,248,0.15)';
        ringRef.current.style.backgroundColor = 'rgba(129,140,248,0.04)';
      }
    };

    const animate = () => {
      const tx = targetRef.current.x;
      const ty = targetRef.current.y;
      posRef.current.x += (tx - posRef.current.x) * 0.12;
      posRef.current.y += (ty - posRef.current.y) * 0.12;

      const x = posRef.current.x;
      const y = posRef.current.y;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 5}px, ${y - 5}px)`;
      }
      if (ringRef.current) {
        const ringSize = ringRef.current.style.width === '40px' ? 20 : 14;
        ringRef.current.style.transform = `translate(${x - ringSize}px, ${y - ringSize}px)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, true);
    document.addEventListener('mouseout', onOut, true);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver, true);
      document.removeEventListener('mouseout', onOut, true);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <Box
        ref={ringRef}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: '1px solid rgba(129,140,248,0.15)',
          bgcolor: 'rgba(129,140,248,0.04)',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'width 0.2s, height 0.2s, border-color 0.2s, background-color 0.2s',
        }}
      />
      <Box
        ref={dotRef}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          borderRadius: '50%',
          bgcolor: '#818cf8',
          boxShadow: '0 0 8px rgba(129,140,248,0.6), 0 0 16px rgba(129,140,248,0.25)',
          pointerEvents: 'none',
          zIndex: 10000,
        }}
      />
    </>
  );
};

export default CustomCursor;
