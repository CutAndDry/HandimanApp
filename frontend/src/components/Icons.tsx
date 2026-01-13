interface IconProps {
  className?: string
}

export const Icons = {
  Wrench: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 1 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  
  DollarSign: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  
  FileText: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  ),
  
  Clock: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  
  Users: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  
  BarChart: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),

  CreditCard: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  
  Settings: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
    </svg>
  ),
  
  Calendar: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  
  Menu: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  
  LogOut: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  
  User: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  
  ChevronRight: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-5 h-5"}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),

  X: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),

  MapPin: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),

  TrendingDown: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  ),

  Bell: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),

  Star: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <polygon points="12 2 15.09 10.26 23.77 11.35 17.88 17.14 19.54 25.85 12 21.77 4.46 25.85 6.12 17.14 0.23 11.35 8.91 10.26 12 2" />
    </svg>
  ),

  MessageSquare: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),

  Camera: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),

  Package: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <path d="M16.5 9.4l-9-5.19" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),

  BarChart3: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),

  Zap: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),

  TrendingUp: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 17" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),

  Shield: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),

  Plug: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <circle cx="12" cy="2" r="1" />
      <path d="M5 7c-1.657 0-3 1.343-3 3v1c0 1.657 1.343 3 3 3h1v3c0 1.657 1.343 3 3 3s3-1.343 3-3v-3h2v3c0 1.657 1.343 3 3 3s3-1.343 3-3v-3h1c1.657 0 3-1.343 3-3V10c0-1.657-1.343-3-3-3" />
      <line x1="12" y1="20" x2="12" y2="23" />
    </svg>
  ),

  ChevronDown: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-5 h-5"}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),

  Home: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className || "w-6 h-6"}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
}