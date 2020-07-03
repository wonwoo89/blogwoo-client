export default (dateValue, format) => {
  const zeroPadded = d => (d < 10 ? `0${d}` : d);
  const monthNameArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const newDate = new Date(dateValue);
  const fullYear = newDate.getFullYear().toString();
  const shortYear = fullYear.substr(2, 4);
  const month = zeroPadded(newDate.getMonth() + 1);
  const monthName = monthNameArr[+month - 1];
  const date = zeroPadded(newDate.getDate());
  const hour = zeroPadded(newDate.getHours());
  const min = zeroPadded(newDate.getMinutes());
  const sec = zeroPadded(newDate.getSeconds());
  const rules = [
    { reg: /(%Y)/g, value: fullYear },
    { reg: /(%y)/g, value: shortYear },
    { reg: /(%m)/g, value: month },
    { reg: /(%b)/g, value: monthName },
    { reg: /(%d)/g, value: date },
    { reg: /(%H)/g, value: hour },
    { reg: /(%M)/g, value: min },
    { reg: /(%S)/g, value: sec },
  ];

  if (!dateValue) {
    return;
  }

  return rules.reduce((a, { reg, value }) => a.replace(reg, value), format);
};
