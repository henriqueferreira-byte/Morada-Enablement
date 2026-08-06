/* Inline Tabler-style icons used by the brokers panel.
 * Same conventions as morada-platform/Icons.jsx — kept here so this kit
 * stands alone without cross-kit imports.
 */

const PCIcon = ({ size = 18, children, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {children}
  </svg>
);

const PCIconHome           = (p) => <PCIcon {...p}><path d="M5 12L12 5l7 7"/><path d="M5 12v7h14v-7"/><path d="M10 19v-5h4v5"/></PCIcon>;
const PCIconDashboard      = (p) => <PCIcon {...p}><rect x="4" y="4" width="6" height="8" rx="1"/><rect x="14" y="4" width="6" height="4" rx="1"/><rect x="14" y="12" width="6" height="8" rx="1"/><rect x="4" y="16" width="6" height="4" rx="1"/></PCIcon>;
const PCIconUsers          = (p) => <PCIcon {...p}><circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2"/><path d="M3 21v-1a6 6 0 0112 0v1"/><path d="M15 21a4 4 0 016-3.5"/></PCIcon>;
const PCIconUserCheck      = (p) => <PCIcon {...p}><circle cx="9" cy="8" r="3"/><path d="M3 21v-1a6 6 0 0112 0v1"/><path d="M15 11l2 2 4-4"/></PCIcon>;
const PCIconChartBar       = (p) => <PCIcon {...p}><path d="M3 21h18"/><rect x="5" y="10" width="3" height="9"/><rect x="11" y="6" width="3" height="13"/><rect x="17" y="13" width="3" height="6"/></PCIcon>;
const PCIconSend           = (p) => <PCIcon {...p}><path d="M3 11l18-7-7 18-3-8z"/></PCIcon>;
const PCIconChevronDown    = (p) => <PCIcon {...p}><path d="M6 9l6 6 6-6"/></PCIcon>;
const PCIconTrendingUp     = (p) => <PCIcon {...p}><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></PCIcon>;
const PCIconTrendingDown   = (p) => <PCIcon {...p}><path d="M3 7l6 6 4-4 8 8"/><path d="M14 17h7v-7"/></PCIcon>;
const PCIconBuilding       = (p) => <PCIcon {...p}><path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14"/><path d="M3 21h18"/><path d="M7 9h2M7 13h2M7 17h2M14 9h2M14 13h2M14 17h2"/></PCIcon>;
const PCIconHeadset        = (p) => <PCIcon {...p}><path d="M4 14a8 8 0 0116 0"/><path d="M4 14v3a2 2 0 002 2h1v-5H4z"/><path d="M20 14v3a2 2 0 01-2 2h-1v-5h3z"/></PCIcon>;
const PCIconMegaphone      = (p) => <PCIcon {...p}><path d="M3 11v2a2 2 0 002 2h1l5 4V5L6 9H5a2 2 0 00-2 2z"/><path d="M16 9a3 3 0 010 6"/></PCIcon>;
const PCIconArrowsSplit    = (p) => <PCIcon {...p}><path d="M21 17h-3l-7-9H4"/><path d="M21 7h-3l-3 4"/><path d="M18 14l3 3-3 3"/><path d="M18 4l3 3-3 3"/></PCIcon>;
const PCIconSettings       = (p) => <PCIcon {...p}><circle cx="12" cy="12" r="3"/><path d="M5 12a7 7 0 011-3.5L4 7l2-2 1.5 2A7 7 0 0112 5V3h0v2a7 7 0 014.5 1.5L18 5l2 2-2 1.5A7 7 0 0119 12a7 7 0 01-1 3.5L20 17l-2 2-1.5-2A7 7 0 0112 19v0a7 7 0 01-4.5-1.5L6 19l-2-2 1.5-1.5A7 7 0 015 12z"/></PCIcon>;
const PCIconBell           = (p) => <PCIcon {...p}><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M14 21a2 2 0 01-4 0"/></PCIcon>;
const PCIconSearch         = (p) => <PCIcon {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></PCIcon>;
const PCIconHelp           = (p) => <PCIcon {...p}><circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></PCIcon>;
const PCIconMore           = (p) => <PCIcon {...p}><circle cx="12" cy="6" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="18" r="1.4"/></PCIcon>;
const PCIconExport         = (p) => <PCIcon {...p}><path d="M12 3v12"/><path d="M7 8l5-5 5 5"/><path d="M5 21h14"/></PCIcon>;
const PCIconX              = (p) => <PCIcon {...p}><path d="M6 6l12 12M18 6L6 18"/></PCIcon>;
const PCIconCalendar       = (p) => <PCIcon {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 3v4M16 3v4"/></PCIcon>;
const PCIconUserShare      = (p) => <PCIcon {...p}><circle cx="9" cy="8" r="3"/><path d="M3 21v-1a6 6 0 0112 0v1"/><path d="M16 8h5M19 5l3 3-3 3"/></PCIcon>;
const PCIconTarget         = (p) => <PCIcon {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></PCIcon>;
const PCIconBookmark       = (p) => <PCIcon {...p}><path d="M6 4h12v17l-6-4-6 4z"/></PCIcon>;
const PCIconBook           = (p) => <PCIcon {...p}><path d="M3 5a2 2 0 012-2h6v18H5a2 2 0 01-2-2V5z"/><path d="M21 5a2 2 0 00-2-2h-6v18h6a2 2 0 002-2V5z"/></PCIcon>;
const PCIconSparkles       = (p) => <PCIcon {...p}><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/></PCIcon>;
const PCIconStar           = (p) => <PCIcon {...p}><path d="M12 2.6l2.6 6 6.4.6-4.9 4.3 1.5 6.3L12 16.6 6.4 19.8l1.5-6.3L3 9.2l6.4-.6z"/></PCIcon>;

Object.assign(window, {
  PCIconHome, PCIconDashboard, PCIconUsers, PCIconUserCheck, PCIconChartBar,
  PCIconSend, PCIconChevronDown, PCIconTrendingUp, PCIconTrendingDown,
  PCIconBuilding, PCIconHeadset, PCIconMegaphone, PCIconArrowsSplit,
  PCIconSettings, PCIconBell, PCIconSearch, PCIconHelp, PCIconMore,
  PCIconExport, PCIconX, PCIconCalendar, PCIconUserShare, PCIconTarget,
  PCIconBookmark, PCIconBook, PCIconSparkles, PCIconStar,
});
