import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type MenuState = {
  profileMenuOpen: boolean;
  settingsOpen: boolean;

  setProfileMenuOpen: Dispatch<SetStateAction<boolean>>;
  setSettingsOpen: Dispatch<SetStateAction<boolean>>;

  clearProfileCloseTimeout: () => void;
  clearSettingsCloseTimeout: () => void;

  scheduleProfileMenuClose: () => void;
  scheduleSettingsMenuClose: () => void;
};

export function useSidebarMenu(
  sidebarOpen: boolean,
  profileInitiallyOpen: boolean,
  settingsInitiallyOpen: boolean,
): MenuState {
  const [profileMenuOpen, setProfileMenuOpen] = useState(profileInitiallyOpen);

  const [settingsOpen, setSettingsOpen] = useState(settingsInitiallyOpen);

  const profileTimer = useRef<number | null>(null);
  const settingsTimer = useRef<number | null>(null);

  const clearProfileCloseTimeout = useCallback(() => {
    if (profileTimer.current !== null) {
      window.clearTimeout(profileTimer.current);
      profileTimer.current = null;
    }
  }, []);

  const clearSettingsCloseTimeout = useCallback(() => {
    if (settingsTimer.current !== null) {
      window.clearTimeout(settingsTimer.current);
      settingsTimer.current = null;
    }
  }, []);

  const scheduleProfileMenuClose = useCallback(() => {
    if (sidebarOpen) return;

    clearProfileCloseTimeout();

    profileTimer.current = window.setTimeout(() => {
      setProfileMenuOpen(false);
      profileTimer.current = null;
    }, 180);
  }, [sidebarOpen, clearProfileCloseTimeout]);

  const scheduleSettingsMenuClose = useCallback(() => {
    if (sidebarOpen) return;

    clearSettingsCloseTimeout();

    settingsTimer.current = window.setTimeout(() => {
      setSettingsOpen(false);
      settingsTimer.current = null;
    }, 180);
  }, [sidebarOpen, clearSettingsCloseTimeout]);

  useEffect(() => {
    return () => {
      clearProfileCloseTimeout();
      clearSettingsCloseTimeout();
    };
  }, [clearProfileCloseTimeout, clearSettingsCloseTimeout]);

  return {
    profileMenuOpen,
    settingsOpen,
    setProfileMenuOpen,
    setSettingsOpen,
    clearProfileCloseTimeout,
    clearSettingsCloseTimeout,
    scheduleProfileMenuClose,
    scheduleSettingsMenuClose,
  };
}
