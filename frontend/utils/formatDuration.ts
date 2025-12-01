
export const formatDuration = (totalMinutes: number): string => {
    if (totalMinutes < 1) {
      return "0 minutes";
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    let result = '';
    if (hours > 0) {
      result += `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      if (result) result += ' ';
      result += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    return result || '0 minutes';
};
