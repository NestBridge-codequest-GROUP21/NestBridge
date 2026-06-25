export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 17) {
    return 'Good afternoon';
  }
  return 'Good evening';
}

export function getPersonalizedGreeting(firstName: string, cityLabel?: string): string {
  const time = getTimeGreeting();
  const name = firstName.trim() || 'there';
  if (cityLabel?.trim()) {
    return `${time}, ${name}`;
  }
  return `${time}, ${name}`;
}
