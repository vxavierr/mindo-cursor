/**
 * Utility functions for time and date manipulation
 * Consolidates duplicated time/date logic across the application
 */

/**
 * Formats seconds into HH:MM:SS or MM:SS format
 * @param seconds - The number of seconds to format
 * @returns Formatted time string
 */
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Calculates the number of days since a given date
 * @param createdAt - ISO date string
 * @returns Number of days since creation
 */
export const getDaysFromCreation = (createdAt: string): number => {
  const now = new Date();
  const created = new Date(createdAt);
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Formats a date to Brazilian Portuguese format
 * @param date - Date object or ISO string
 * @returns Formatted date string (DD/MM/YYYY)
 */
export const formatDateBR = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR');
};

/**
 * Formats a date to a relative time string (e.g., "há 2 dias")
 * @param date - Date object or ISO string
 * @returns Relative time string in Portuguese
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'agora mesmo';
  }
  
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  }
  
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `há ${hours} hora${hours > 1 ? 's' : ''}`;
  }
  
  const days = Math.floor(diffInSeconds / 86400);
  if (days < 30) {
    return `há ${days} dia${days > 1 ? 's' : ''}`;
  }
  
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `há ${months} mês${months > 1 ? 'es' : ''}`;
  }
  
  const years = Math.floor(months / 12);
  return `há ${years} ano${years > 1 ? 's' : ''}`;
};

/**
 * Checks if a date is today
 * @param date - Date object or ISO string
 * @returns Whether the date is today
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Gets the greeting based on current time
 * @returns Appropriate greeting in Portuguese
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
};