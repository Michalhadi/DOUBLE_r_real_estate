import type { SidebarGroup } from "@/components/nav/Sidebar";
import {
  LayoutIcon, UsersIcon, CalendarIcon, BriefcaseIcon, InboxIcon, SparkleIcon, BookIcon, ImageIcon,
  BarChartIcon, SettingsIcon, PlugIcon, GlobeIcon,
} from "@/components/icons";

export const RE_NAV: SidebarGroup[] = [
  { items: [{ id: "dashboard", label: "Dashboard", icon: <LayoutIcon size={18} />, href: "/real-estate/dashboard" }] },
  {
    label: "SALES",
    items: [
      { id: "leads", label: "Leads", icon: <UsersIcon size={18} />, href: "/real-estate/leads" },
      { id: "viewings", label: "Viewings", icon: <CalendarIcon size={18} />, href: "/real-estate/viewings" },
      { id: "projects", label: "Projects", icon: <BriefcaseIcon size={18} />, href: "/real-estate/projects" },
    ],
  },
  { label: "LIVE CHAT", items: [{ id: "inbox", label: "Inbox", icon: <InboxIcon size={18} />, href: "/real-estate/inbox" }] },
  {
    label: "AI REP",
    items: [
      { id: "rep", label: "Rep & page design", icon: <SparkleIcon size={18} />, href: "/real-estate/rep" },
      { id: "listpage", label: "Properties page", icon: <LayoutIcon size={18} />, href: "/real-estate/rep?tab=properties" },
      { id: "prompt", label: "Base prompt", icon: <BookIcon size={18} />, href: "/real-estate/base-prompt" },
      { id: "media", label: "Media library", icon: <ImageIcon size={18} />, href: "/real-estate/media" },
    ],
  },
  { label: "INSIGHTS", items: [{ id: "sources", label: "Sources", icon: <BarChartIcon size={18} />, href: "/real-estate/sources" }] },
  {
    label: "SETTINGS",
    items: [
      { id: "sheet", label: "Google Sheet", icon: <PlugIcon size={18} />, href: "/real-estate/settings?tab=sheet" },
      { id: "whatsapp", label: "WhatsApp", icon: <GlobeIcon size={18} />, href: "/real-estate/settings?tab=whatsapp" },
      { id: "team", label: "Team & workspace", icon: <SettingsIcon size={18} />, href: "/real-estate/settings?tab=team" },
    ],
  },
];
