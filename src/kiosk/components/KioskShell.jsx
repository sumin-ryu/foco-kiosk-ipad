import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import KioskFrame, { SCREEN_HEIGHT, SCREEN_WIDTH } from './KioskFrame.jsx';
import './KioskShell.css';
import './kioskIpad.css';

/**
 * iPad on-device: no bezel. Canvas stays 540×960 and is centered with a single
 * scale (transform-origin center) so it doesn’t drift on the tablet.
 */
function useStageSize(ref) {
  const [size, setSize] = useState({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.visualViewport?.addEventListener('resize', measure);
    window.visualViewport?.addEventListener('scroll', measure);
    return () => {
      ro.disconnect();
      window.visualViewport?.removeEventListener('resize', measure);
      window.visualViewport?.removeEventListener('scroll', measure);
    };
  }, [ref]);
  return size;
}

export default function KioskShell({ children }) {
  const stageRef = useRef(null);
  const { width, height } = useStageSize(stageRef);
  const scale = Math.min(width / SCREEN_WIDTH, height / SCREEN_HEIGHT);
  const embed = new URLSearchParams(useLocation().search).get('embed') === '1';

  if (embed) {
    return (
      <div className="kiosk-stage kiosk-stage--plain kiosk-stage--embed">
        <div className="kiosk-stage__fit">{children}</div>
      </div>
    );
  }

  return (
    <div ref={stageRef} className="kiosk-stage kiosk-stage--plain kiosk-stage--ipad">
      <div
        className="kiosk-stage__canvas"
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        <KioskFrame enabled={false} scale={1}>
          {children}
        </KioskFrame>
      </div>
    </div>
  );
}
