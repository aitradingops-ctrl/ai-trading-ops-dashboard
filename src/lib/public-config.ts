export const publicConfig = {
  appDomain: process.env.NEXT_PUBLIC_APP_DOMAIN || "aitradingops.pro",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "AI Trading Ops",
  projectDriveUrl:
    process.env.NEXT_PUBLIC_PROJECT_DRIVE_URL ||
    "https://drive.google.com/drive/folders/1H__9S7AdYV5d4XYw6hSqN-QDXInXEF2Q?usp=sharing",
  tradingCalendarUrl:
    process.env.NEXT_PUBLIC_TRADING_CALENDAR_URL ||
    "https://calendar.google.com/calendar/u/2?cid=YjFjNmU3N2VhYjI3Yjk0OTA2NDRjMWQ0MWI1NDI4M2Q2NzhmY2FjZmZjZTQyZGIyNTVjYmUxMzJmZmY3NTBmYUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
  tradingCalendarId:
    process.env.NEXT_PUBLIC_TRADING_CALENDAR_ID ||
    "b1c6e77eab27b9490644c1d41b54283d678fcacffce42db255cbe132fff750fa@group.calendar.google.com",
  googleChatUrl:
    process.env.NEXT_PUBLIC_GOOGLE_CHAT_URL ||
    "https://chat.google.com/room/AAQA_c_Zwls?cls=7",
} as const;

export function getTradingCalendarEmbedUrl(): string {
  const params = new URLSearchParams({
    src: publicConfig.tradingCalendarId,
    ctz: "America/Chicago",
    mode: "MONTH",
    showTitle: "0",
    showPrint: "0",
    showTabs: "1",
    showCalendars: "0",
    showTz: "1",
  });

  return `https://calendar.google.com/calendar/embed?${params.toString()}`;
}
