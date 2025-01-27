'use client';

import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

export function AudioSwitch({
  isEnable = false,
  onChange,
}: {
  isEnable?: boolean;
  onChange?: (isEnabled: boolean, audioElment: HTMLAudioElement) => void;
}) {
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(isEnable);

  const handleClick = () => {
    setIsAudioEnabled((prev: boolean) => !prev);
    if (!onChange) return;
    const autdioElement = document.getElementById(
      'scanner-beep'
    ) as HTMLAudioElement;
    onChange(!isAudioEnabled /*its not yet updated*/, autdioElement);
  };

  return (
    <div className="flex w-full flex-row items-center justify-end gap-2 pr-2 pt-2">
      <p className="cursor-pointer text-sm text-white" onClick={handleClick}>
        Scanner Audio {isAudioEnabled ? 'an' : 'aus'}
      </p>
      <Switch onClick={handleClick} checked={isAudioEnabled} />
      <audio
        id="scanner-beep"
        src="/sounds/scanner-beep.mp3"
        hidden
        autoPlay={false}
        //@ts-expect-error not all browsers support this
        disableRemotePlayback
      />
    </div>
  );
}
