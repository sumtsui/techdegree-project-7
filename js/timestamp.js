module.exports = 
function getTimeStamp(date) {
  const months = monthArr();
  const nowMilSec = Date.now();
  const now = new Date(nowMilSec);
  const postTime = new Date(date);
  const postedMilSec = Date.parse(postTime);
  
  const gap = now - postedMilSec;
  const gapInHours = (gap / 1000 / 60 / 60 );
  
  if (gapInHours < 0.2) {
    return (`Just Now`);
  }
  else if (gapInHours < 0.75) {
    return (`${Math.ceil(gapInHours * 60)}min`);
  }
  else if (gapInHours < now.getHours()) {
    return (`${Math.ceil(gapInHours)}H`);
  }
  else if (now.getFullYear() - postTime.getFullYear() > 0) {
    return (`${months[now.getMonth()]} ${now.getDate()} ${now.getFullYear()}`);
  }
  else if (gapInHours > now.getHours() && gapInHours < 24 + now.getHours()) {
    return (`Yesterday`);
  }
  else if (gapInHours > now.getHours() && gapInHours > 24 + now.getHours()) {
    return (`${months[now.getMonth()]} ${now.getDate()}`);
  }
  
  function monthArr() {
    const month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    return month;
  }
}