import { useCallback, useRef, useState } from 'react';

interface UseLongPressOptions {
  onLongPress: () => void;
  delay?: number;
  shouldPreventDefault?: boolean;
  shouldStopPropagation?: boolean;
}

interface UseLongPressReturn {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
  isLongPressing: boolean;
  progress: number;
}

export const useLongPress = ({
  onLongPress,
  delay = 1000,
  shouldPreventDefault = false,
  shouldStopPropagation = false,
}: UseLongPressOptions): UseLongPressReturn => {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const timeout = useRef<NodeJS.Timeout>();
  const progressInterval = useRef<NodeJS.Timeout>();
  const target = useRef<EventTarget>();

  const start = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      // Don't prevent default or stop propagation for normal clicks
      target.current = event.target;
      setIsLongPressing(true);
      setProgress(0);

      // Progress animation
      let progressValue = 0;
      progressInterval.current = setInterval(() => {
        progressValue += (100 / delay) * 100; // Update every 100ms for smoother animation
        if (progressValue >= 100) {
          progressValue = 100;
          clearInterval(progressInterval.current);
        }
        setProgress(progressValue);
      }, 100);

      timeout.current = setTimeout(() => {
        onLongPress();
        clear();
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault, shouldStopPropagation]
  );

  const clear = useCallback(() => {
    timeout.current && clearTimeout(timeout.current);
    progressInterval.current && clearInterval(progressInterval.current);
    setIsLongPressing(false);
    setProgress(0);
    target.current = undefined;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => start(e), [start]);
  const handleMouseDown = useCallback((e: React.MouseEvent) => start(e), [start]);

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: clear,
    onTouchMove: clear,
    onMouseDown: handleMouseDown,
    onMouseUp: clear,
    onMouseLeave: clear,
    isLongPressing,
    progress,
  };
};