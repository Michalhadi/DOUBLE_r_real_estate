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
      { id: "leads", label: "Leads", icon: <UsersIcon size={18} />, href: "#leads" },
      { id: "viewings", label: "Viewings", icon: <CalendarIcon size={18} />, href: "#" },
      { id: "projects", label: "Projects", icon: <BriefcaseIcon size={18} />, href: "/real-estate/properties" },
    ],
  },
  { label: "LIVE CHAT", items: [{ id: "inbox", label: "Inbox", icon: <InboxIcon size={18} />, href: "#" }] },
  {
    label: "AI REP",
    items: [
      { id: "rep", label: "Rep persona", icon: <SparkleIcon size={18} />, href: "/real-estate/agent" },
      { id: "prompt", label: "Base prompt", icon: <BookIcon size={18} />, href: "#" },
      { id: "media", label: "Media library", icon: <ImageIcon size={18} />, href: "#" },
    ],
  },
  { label: "INSIGHTS", items: [{ id: "sources", label: "Sources", icon: <BarChartIcon size={18} />, href: "#sources" }] },
  {
    label: "SETTINGS",
    items: [
      { id: "sheet", label: "Google Sheet", icon: <PlugIcon size={18} />, href: "#" },
      { id: "whatsapp", label: "WhatsApp", icon: <GlobeIcon size={18} />, href: "#" },
      { id: "team", label: "Team & workspace", icon: <SettingsIcon size={18} />, href: "#" },
    ],
  },
];
