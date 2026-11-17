import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { SidebarActionProps } from "./sidebar.types";

type TooltipPosition = Readonly<{
  top: number;
  left: number;
}>;

type SidebarTooltipProps = Readonly<{
  id: string;
  label: string;
  dark: boolean;
  visible: boolean;
  position: TooltipPosition | null;
}>;

const TOOLTIP_OFFSET_PX = 12;

function SidebarTooltip({
  id,
  label,
  dark,
  visible,
  position,
}: SidebarTooltipProps) {
  if (!visible || !position || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <span
      id={id}
      role="tooltip"
      className={`aserco-sidebar-tooltip ${dark ? "is-dark" : "is-light"}`}
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {label}
      <span className="aserco-sidebar-tooltip-arrow" />
    </span>,
    document.body,
  );
}

export function SidebarAction({
  icon: Icon,
  label,
  sidebarOpen,
  dark,
  active = false,
  danger = false,
  nested = false,
  avatarSrc,
  avatarAlt,
  onAvatarError,
  onClick,
}: SidebarActionProps) {
  const tooltipId = useId();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] =
    useState<TooltipPosition | null>(null);

  const updateTooltipPosition = useCallback(() => {
    const button = buttonRef.current;

    if (!button) return;

    const rect = button.getBoundingClientRect();

    setTooltipPosition({
      top: rect.top + rect.height / 2,
      left: rect.right + TOOLTIP_OFFSET_PX,
    });
  }, []);

  const showTooltip = useCallback(() => {
    if (sidebarOpen) return;

    updateTooltipPosition();
    setTooltipVisible(true);
  }, [sidebarOpen, updateTooltipPosition]);

  const hideTooltip = useCallback(() => {
    setTooltipVisible(false);
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      setTooltipVisible(false);
    }
  }, [sidebarOpen]);

  useEffect(() => {
    if (sidebarOpen || !tooltipVisible) return;

    const reposition = () => updateTooltipPosition();

    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);

    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [sidebarOpen, tooltipVisible, updateTooltipPosition]);

  const stateClass = [
    active && "is-active",
    danger && "is-danger",
    nested && "is-nested",
    !sidebarOpen && "is-collapsed",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        aria-label={!sidebarOpen ? label : undefined}
        aria-describedby={
          !sidebarOpen && tooltipVisible ? tooltipId : undefined
        }
        aria-current={active ? "page" : undefined}
        className={`aserco-sidebar-action ${stateClass}`}
      >

        <span className="aserco-sidebar-action-icon">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={avatarAlt ?? "Avatar"}
              onError={onAvatarError}
              className="aserco-sidebar-avatar"
            />
          ) : (
            <Icon
              size={nested && sidebarOpen ? 17 : 19}
              strokeWidth={active ? 2.2 : 1.9}
              aria-hidden="true"
            />
          )}
        </span>

        <span className="aserco-sidebar-action-label">{label}</span>
      </button>

      <SidebarTooltip
        id={tooltipId}
        label={label}
        dark={dark}
        visible={!sidebarOpen && tooltipVisible}
        position={tooltipPosition}
      />
    </>
  );
}
