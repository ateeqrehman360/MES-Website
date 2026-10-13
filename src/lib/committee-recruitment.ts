export const recruitmentSessionKey = "mes:committee-recruitment:2026-27:seen";
export const recruitmentDelay = 2_000;

const londonDate = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function isRecruitmentOpen(now = new Date()): boolean {
  const parts = londonDate.formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value;
  // Compare calendar dates in London, independently of the visitor's timezone
  // and the UK's daylight-saving change on 25 October 2026.
  return `${part("year")}-${part("month")}-${part("day")}` < "2026-10-28";
}

export function isRecruitmentPage(pathname: string): boolean {
  return pathname === "/" || pathname === "/work-with-us";
}
