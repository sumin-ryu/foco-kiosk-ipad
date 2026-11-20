import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import KioskFrame, { SCREEN_HEIGHT, SCREEN_WIDTH } from './KioskFrame.jsx';
import './KioskShell.css';
import './kioskIpad.css';

/**
 * iPad on-device build: always bare (no kiosk bezel/stand), scaled to fill the
 * tablet. Design canvas stays 540×960; iPad 9 (~810×1080 portrait) contain-fits.
 */
function useViewport() {
  const read = () => ({ width: window.innerWidth, height: window.innerHeight });
  const [viewport, setViewport] = useState(read);
  useEffect(() => {
    const onResize = () => setViewport(read());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return viewport;
}

function getScale({ width, height }) {
  return Math.min(width / SCREEN_WIDTH, height / SCREEN_HEIGHT);
}

export default function KioskShell({ children }) {
  const viewport = useViewport();
  const scale = getScale(viewport);
  const embed = new URLSearchParams(useLocation().search).get('embed') === '1';

  if (embed) {
    return (
      <div className="kiosk-stage kiosk-stage--plain kiosk-stage--embed">
        <div className="kiosk-stage__fit">{children}</div>
      </div>
    );
  }

  return (
    <div className="kiosk-stage kiosk-stage--plain kiosk-stage--ipad">
      <div
        className="kiosk-stage__fit"
        style={{ width: SCREEN_WIDTH * scale, height: SCREEN_HEIGHT * scale }}
      >
        <KioskFrame enabled={false} scale={scale}>
          {children}
        </KioskFrame>
      </div>
    </div>
  );
}
