/* Tabler-style stroke icons (24×24 canvas, stroke-width 2) used across the
 * Morada Platform kit. Inlined here rather than depending on the npm package
 * so this kit is portable to any static prototype.
 *
 * Each component accepts standard SVG props + an optional `size` shortcut.
 */

const Icon = ({ size = 18, children, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

const IconHome           = (p) => <Icon {...p}><path d="M5 12L12 5l7 7"/><path d="M5 12v7h14v-7"/><path d="M10 19v-5h4v5"/></Icon>;
const IconDashboard      = (p) => <Icon {...p}><rect x="4" y="4" width="6" height="8" rx="1"/><rect x="14" y="4" width="6" height="4" rx="1"/><rect x="14" y="12" width="6" height="8" rx="1"/><rect x="4" y="16" width="6" height="4" rx="1"/></Icon>;
const IconHeadset        = (p) => <Icon {...p}><path d="M4 14a8 8 0 0116 0"/><path d="M4 14v3a2 2 0 002 2h1v-5H4z"/><path d="M20 14v3a2 2 0 01-2 2h-1v-5h3z"/></Icon>;
const IconUsers          = (p) => <Icon {...p}><circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2"/><path d="M3 21v-1a6 6 0 0112 0v1"/><path d="M15 21a4 4 0 016-3.5"/></Icon>;
const IconMegaphone      = (p) => <Icon {...p}><path d="M3 11v2a2 2 0 002 2h1l5 4V5L6 9H5a2 2 0 00-2 2z"/><path d="M16 9a3 3 0 010 6"/></Icon>;
const IconArrowsSplit    = (p) => <Icon {...p}><path d="M21 17h-3l-7-9H4"/><path d="M21 7h-3l-3 4"/><path d="M18 14l3 3-3 3"/><path d="M18 4l3 3-3 3"/></Icon>;
const IconBook           = (p) => <Icon {...p}><path d="M3 5a2 2 0 012-2h6v18H5a2 2 0 01-2-2V5z"/><path d="M21 5a2 2 0 00-2-2h-6v18h6a2 2 0 002-2V5z"/></Icon>;
const IconSparkles       = (p) => <Icon {...p}><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z"/></Icon>;
const IconSettings       = (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3h0a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8v0a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></Icon>;
const IconBell           = (p) => <Icon {...p}><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M14 21a2 2 0 01-4 0"/></Icon>;
const IconSearch         = (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></Icon>;
const IconHelpCircle     = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></Icon>;
const IconArrowUp        = (p) => <Icon {...p}><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></Icon>;
const IconArrowUpRight   = (p) => <Icon {...p}><path d="M7 17L17 7"/><path d="M8 7h9v9"/></Icon>;
const IconTrendingUp     = (p) => <Icon {...p}><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></Icon>;
const IconTrendingDown   = (p) => <Icon {...p}><path d="M3 7l6 6 4-4 8 8"/><path d="M14 17h7v-7"/></Icon>;
const IconMessageCircle  = (p) => <Icon {...p}><path d="M21 12c0 4.418-4.03 8-9 8a9.7 9.7 0 01-4-.86L3 20l1.27-3.4A7.4 7.4 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></Icon>;
const IconClock          = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>;
const IconBolt           = (p) => <Icon {...p}><path d="M13 3L4 14h7l-1 7 9-11h-7z"/></Icon>;
const IconCalendarEvent  = (p) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 3v4M16 3v4"/><circle cx="12" cy="14" r="1.5" fill="currentColor"/></Icon>;
const IconBellRinging    = (p) => <Icon {...p}><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M14 21a2 2 0 01-4 0"/><path d="M2 8l2-3M22 8l-2-3"/></Icon>;
const IconCircleCheck    = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></Icon>;
const IconStar           = (p) => <Icon {...p}><path d="M12 2.6l2.6 6 6.4.6-4.9 4.3 1.5 6.3L12 16.6 6.4 19.8l1.5-6.3L3 9.2l6.4-.6z"/></Icon>;
const IconChevronRight   = (p) => <Icon {...p}><path d="M9 6l6 6-6 6"/></Icon>;
const IconChevronDown    = (p) => <Icon {...p}><path d="M6 9l6 6 6-6"/></Icon>;
const IconMenu           = (p) => <Icon {...p}><path d="M4 6h16M4 12h16M4 18h16"/></Icon>;

Object.assign(window, {
  IconHome, IconDashboard, IconHeadset, IconUsers, IconMegaphone, IconArrowsSplit,
  IconBook, IconSparkles, IconSettings, IconBell, IconSearch, IconHelpCircle,
  IconArrowUp, IconArrowUpRight, IconTrendingUp, IconTrendingDown,
  IconMessageCircle, IconClock, IconBolt, IconCalendarEvent, IconBellRinging,
  IconCircleCheck, IconStar, IconChevronRight, IconChevronDown, IconMenu,
});
