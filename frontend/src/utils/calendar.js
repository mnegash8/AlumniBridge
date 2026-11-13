/**
 * AlumniBridge Calendar Utilities
 * Generates Google Calendar links and .ics file downloads for booked mentorship sessions.
 */

// Helper: Parse relative date ('Tomorrow', 'Friday', '2026-11-15') and time ('4:00 PM EST') into Date objects
export function parseSessionDateTime(dateStr = 'Tomorrow', timeStr = '4:00 PM EST', durationMinutes = 45) {
  const now = new Date();
  let targetDate = new Date(now);

  const lowerDate = (dateStr || '').trim().toLowerCase();

  if (lowerDate.includes('tomorrow')) {
    targetDate.setDate(targetDate.getDate() + 1);
  } else if (lowerDate.includes('today')) {
    // keep today
  } else {
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const matchedDayIndex = daysOfWeek.findIndex((d) => lowerDate.includes(d));

    if (matchedDayIndex !== -1) {
      const currentDay = now.getDay();
      let diff = matchedDayIndex - currentDay;
      if (diff <= 0) diff += 7; // schedule next upcoming day
      targetDate.setDate(targetDate.getDate() + diff);
    } else {
      // Try direct date parsing if ISO or date string provided
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        targetDate = parsed;
      } else {
        targetDate.setDate(targetDate.getDate() + 1);
      }
    }
  }

  // Parse time (e.g., '4:00 PM EST', '11:30 AM', '18:00')
  let hours = 16;
  let minutes = 0;
  if (timeStr) {
    const timeMatch = timeStr.match(/(\d+):?(\d*)\s*(am|pm)?/i);
    if (timeMatch) {
      let h = parseInt(timeMatch[1], 10);
      const m = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
      const meridiem = (timeMatch[3] || '').toLowerCase();

      if (meridiem === 'pm' && h < 12) h += 12;
      if (meridiem === 'am' && h === 12) h = 0;

      hours = h;
      minutes = m;
    }
  }

  targetDate.setHours(hours, minutes, 0, 0);

  const endDate = new Date(targetDate.getTime() + durationMinutes * 60 * 1000);

  return { startDate: targetDate, endDate };
}

// Format date to ISO UTC format for calendars: YYYYMMDDTHHmmssZ
function formatToCalFormat(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  );
}

/**
 * Generate a Google Calendar 1-click URL
 */
export function generateGoogleCalendarUrl({
  mentorName = 'Alumni Mentor',
  mentorCompany = '',
  serviceTitle = '1-on-1 Mentorship Session',
  sessionDate = 'Tomorrow',
  sessionTime = '4:00 PM EST',
  durationMinutes = 45,
  prepQuestions = [],
  sessionFocus = null,
  bookingId = 'AB-101',
  meetUrl = 'https://meet.google.com/ab-mentorship'
}) {
  const { startDate, endDate } = parseSessionDateTime(sessionDate, sessionTime, durationMinutes);
  const startStr = formatToCalFormat(startDate);
  const endStr = formatToCalFormat(endDate);

  const title = `AlumniBridge: ${serviceTitle} with ${mentorName} ${mentorCompany ? `(${mentorCompany})` : ''}`.trim();

  let details = `AlumniBridge 1-on-1 Mentorship Session (100% Free)\n\n`;
  details += `• Alumni Mentor: ${mentorName} ${mentorCompany ? `at ${mentorCompany}` : ''}\n`;
  details += `• Topic/Service: ${serviceTitle}\n`;
  details += `• Booking Reference: ${bookingId}\n`;
  details += `• Virtual Room: ${meetUrl}\n\n`;

  if (sessionFocus) {
    if (sessionFocus.key_focus_areas && sessionFocus.key_focus_areas.length > 0) {
      details += `WHAT TO TALK ABOUT & FOCUS ON:\n`;
      sessionFocus.key_focus_areas.forEach((fa) => {
        details += `• ${fa}\n`;
      });
      details += `\n`;
    }
    if (sessionFocus.discussion_agenda && sessionFocus.discussion_agenda.length > 0) {
      details += `SUGGESTED AGENDA:\n`;
      sessionFocus.discussion_agenda.forEach((step) => {
        details += `• ${step.phase} - ${step.title}: ${step.focus}\n`;
      });
      details += `\n`;
    }
  }

  if (prepQuestions && prepQuestions.length > 0) {
    details += `Recommended Questions for this Call:\n`;
    prepQuestions.forEach((q, i) => {
      details += `${i + 1}. ${q}\n`;
    });
    details += `\n`;
  }

  details += `Created via AlumniBridge (Georgia State University) — Connecting Students with Alumni.`;

  const location = `Google Meet / Virtual Room (${meetUrl})`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startStr}/${endStr}`,
    details: details,
    location: location
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate and trigger download of an .ics iCalendar file for Apple Calendar, Outlook, etc.
 */
export function downloadIcsFile({
  mentorName = 'Alumni Mentor',
  mentorCompany = '',
  serviceTitle = '1-on-1 Mentorship Session',
  sessionDate = 'Tomorrow',
  sessionTime = '4:00 PM EST',
  durationMinutes = 45,
  prepQuestions = [],
  sessionFocus = null,
  bookingId = 'AB-101',
  meetUrl = 'https://meet.google.com/ab-mentorship'
}) {
  const { startDate, endDate } = parseSessionDateTime(sessionDate, sessionTime, durationMinutes);
  const startStr = formatToCalFormat(startDate);
  const endStr = formatToCalFormat(endDate);
  const nowStr = formatToCalFormat(new Date());

  const title = `AlumniBridge: ${serviceTitle} with ${mentorName}`;
  const location = `Google Meet / Virtual (${meetUrl})`;

  let desc = `AlumniBridge 1-on-1 Mentorship Session\\n\\nMentor: ${mentorName} ${mentorCompany ? `(${mentorCompany})` : ''}\\nService: ${serviceTitle}\\nBooking ID: ${bookingId}\\nMeeting URL: ${meetUrl}\\n\\n`;

  if (sessionFocus) {
    if (sessionFocus.key_focus_areas && sessionFocus.key_focus_areas.length > 0) {
      desc += `WHAT TO TALK ABOUT & FOCUS ON:\\n`;
      sessionFocus.key_focus_areas.forEach((fa) => {
        desc += `• ${fa.replace(/,/g, '\\,')}\\n`;
      });
      desc += `\\n`;
    }
    if (sessionFocus.discussion_agenda && sessionFocus.discussion_agenda.length > 0) {
      desc += `SESSION AGENDA:\\n`;
      sessionFocus.discussion_agenda.forEach((step) => {
        desc += `• ${step.phase}: ${step.title.replace(/,/g, '\\,')}\\n`;
      });
      desc += `\\n`;
    }
  }

  if (prepQuestions && prepQuestions.length > 0) {
    desc += `AI Preparation Questions:\\n`;
    prepQuestions.forEach((q, i) => {
      desc += `${i + 1}. ${q.replace(/,/g, '\\,')}\\n`;
    });
  }

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AlumniBridge//Mentorship Platform//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:alumnibridge-${bookingId}-${Date.now()}@alumnibridge.edu`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${title.replace(/,/g, '\\,')}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${location.replace(/,/g, '\\,')}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: AlumniBridge Mentorship Session starting in 15 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `alumnibridge-${bookingId || 'session'}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
