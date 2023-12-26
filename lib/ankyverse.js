function daysBetweenDates(start, end) {
  const oneDay = 24 * 60 * 60 * 1000; // Hours, minutes, seconds, milliseconds
  return Math.round((end - start) / oneDay);
}

function getAnkyverseQuestion(wink) {
  const questionCycle = [
    "What were your basic needs as a child, and how were they met?",
    "What was your earliest memory of feeling passionate about something?",
    "Can you recall a time in your life when you had to muster up all your willpower to face a situation?",
    "When was the first time you experienced pure love and compassion?",
    "How would you express your 'self' to a stranger using only five words?",
    "What was a significant moment where you relied on your intuition?",
    "Describe a moment when you felt a profound sense of enlightenment or connection to the universe.",
    "Can you remember the first time you created something that truly expressed who you were?",
    "How has your approach to survival and safety changed since your early years?",
    "How do you channel your passions and emotions constructively?",
    "What does personal transformation mean to you, and how have you pursued it?",
    "When have you given or received love unconditionally?",
    "Can you recall a time when your communication or self-expression was misunderstood?",
    "How does your intuition guide your daily life?",
    "How do you cultivate a connection with the universe or a higher power?",
    "How has your creativity evolved over time?",
    "How do your childhood survival instincts still impact you today?",
    "How does your emotional and passionate energy drive your relationships and interactions?",
    "What aspects of your life would you like to transform, and why?",
    "How do you balance giving and receiving love in your relationships?",
    "How do you navigate misunderstandings or miscommunications in your life?",
    "How do you balance intuition with logic in decision-making?",
    "What practices or beliefs help you maintain a connection with the universe?",
    "What role does creativity play in your understanding and expression of your uniqueness?",
  ];

  return questionCycle[(wink - 1) % 24];
}

function getAnkyverseDay(date) {
  const ankyverseStart = new Date("2023-08-10T05:00:00-04:00");
  const daysInSojourn = 96;
  const daysInSlumber = 21;
  const cycleLength = daysInSojourn + daysInSlumber; // 117 days
  const kingdoms = [
    "Primordia",
    "Emblazion",
    "Chryseos",
    "Eleasis",
    "Voxlumis",
    "Insightia",
    "Claridium",
    "Poiesis",
  ];

  const elapsedDays = daysBetweenDates(ankyverseStart, date);
  const currentSojourn = Math.floor(elapsedDays / cycleLength) + 1;
  const dayWithinCurrentCycle = elapsedDays % cycleLength;

  let currentKingdom, status, wink;
  if (dayWithinCurrentCycle < daysInSojourn) {
    status = "Sojourn";
    wink = dayWithinCurrentCycle + 1; // Wink starts from 1
    currentKingdom = kingdoms[dayWithinCurrentCycle % 8];
  } else {
    status = "Great Slumber";
    wink = null; // No Wink during the Great Slumber
    currentKingdom = "None";
  }
  return {
    date: date.toISOString(),
    currentSojourn,
    status,
    currentKingdom,
    wink,
  };
}

module.exports = { getAnkyverseDay, getAnkyverseQuestion };
