export function calculateElapsedTime(dateSince) {
  const dateNow = new Date();
  let timeElapsed = (dateNow - dateSince) / 60000;
  let timeUnit = "minutes ago";
  let newTime = timeElapsed;

  if (timeElapsed < 1) {
    newTime = timeElapsed * 60;
    if (newTime < 2) timeUnit = "second ago";
    else timeUnit = "seconds ago";
  } else if (timeElapsed < 2) {
    timeUnit = "minute ago";
  } else if (timeElapsed > 60 && timeElapsed < 1440) {
    newTime = timeElapsed / 60;
    if (newTime < 2) timeUnit = "hour ago";
    else timeUnit = "hours ago";
  } else if (timeElapsed > 1440) {
    newTime = timeElapsed / 1440;
    if (newTime < 2) timeUnit = "day ago";
    else timeUnit = "days ago";
  }

  return `${parseInt(newTime)} ${timeUnit}`;
}

export function getFormattedDate(date) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
}

export function sortByDate(a, b) {
  const date1 = new Date(a.last_modified);
  const date2 = new Date(b.last_modified);
  return date2 - date1;
}
