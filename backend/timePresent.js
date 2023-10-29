function getDateInfo(
  inputYear,
  inputMonth,
  inputDay,
  inputHours,
  inputMinutes
) {
  const currentDate = new Date();
  const targetDate = new Date(
    inputYear,
    inputMonth - 1,
    inputDay,
    inputHours,
    inputMinutes
  );

  const timeDifference = currentDate - targetDate;
  const minuteDifference = Math.floor(timeDifference / (1000 * 60));
  const hourDifference = Math.floor(timeDifference / (1000 * 60 * 60));
  const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (minuteDifference < 60) {
    return `${minuteDifference} min ago`;
  } else if (hourDifference < 24) {
    return `${hourDifference} h ago`;
  } else if (dayDifference < 30) {
    return `${dayDifference} d ago`;
  } else {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const targetMonthName = monthNames[inputMonth - 1];
    return `${targetMonthName} ${inputDay}, ${inputYear}`;
  }
}

module.exports = getDateInfo;
