export const getDate = (date: Date) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(date);

export const creationDate = (date: Date) => {
  const timeDifference = new Date().getTime() - date.getTime();
  const daysAgo = Math.floor(timeDifference / (1000 * 3600 * 24));
  return `${daysAgo} days ago`;
};
