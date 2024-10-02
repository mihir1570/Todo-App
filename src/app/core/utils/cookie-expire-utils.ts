export function setCookieExpirationTime(
  expireTime: number,
  unit: 'seconds' | 'minutes' | 'hours'
): Date {
  const date = new Date();
  switch (unit) {
    case 'seconds':
      date.setTime(date.getTime() + expireTime * 1000);
      break;
    case 'minutes':
      date.setTime(date.getTime() + expireTime * 60 * 1000);
      break;
    case 'hours':
      date.setTime(date.getTime() + expireTime * 60 * 60 * 1000);
      break;
  }
  return date;
}
