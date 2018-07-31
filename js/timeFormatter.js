module.exports = function parseTwitterDate(tdate) {
  // not my code:
  var system_date = new Date(tdate);
  var user_date = new Date();
  var diff = Math.floor((user_date - system_date) / 1000);
  if (diff <= 1) { return "just now"; }
  if (diff < 20) { return diff + " seconds ago"; }
  if (diff < 40) { return "half a minute ago"; }
  if (diff < 60) { return "less than a minute ago"; }
  if (diff <= 90) { return "one minute ago"; }
  if (diff <= 3540) { return Math.round(diff / 60) + " minutes ago"; }
  if (diff <= 5400) { return "1 hour ago"; }
  if (diff <= 86400) { return Math.round(diff / 3600) + " hours ago"; }
  if (diff <= 129600) { return "1 day ago"; }
  if (diff < 604800) { return Math.round(diff / 86400) + " days ago"; }
  if (diff <= 777600) { return "1 week ago"; }
  return `${user_date.getDate()} ${monthArr()[user_date.getMonth() + 1]} ${user_date.getFullYear()}`;
}
// my failed code:
// function getTimeStamp(date) {
//   const months = monthArr();
//   const nowMilSec = Date.now();
//   const now = new Date(nowMilSec);
//   const postTime = new Date(date);
//   const postedMilSec = Date.parse(postTime);
  
//   const gap = now - postedMilSec;
//   const gapInHours = (gap / 1000 / 60 / 60 );
  
//   if (gapInHours < 0.2) {
//     return (`Just Now`);
//   }
//   else if (gapInHours < 0.75) {
//     return (`${Math.ceil(gapInHours * 60)}min`);
//   }
//   else if (gapInHours < now.getHours()) {
//     return (`${Math.ceil(gapInHours)}H`);
//   }
//   else if (now.getFullYear() - postTime.getFullYear() > 0) {
//     return (`${months[now.getMonth()]} ${now.getDate()} ${now.getFullYear()}`);
//   }
//   else if (gapInHours > now.getHours() && gapInHours < 24 + now.getHours()) {
//     return (`Yesterday`);
//   }
//   else if (gapInHours > now.getHours() && gapInHours > 24 + now.getHours()) {
//     return (`${months[now.getMonth()]} ${now.getDate()}`);
//   }
  
function monthArr() {
  const month = new Array();
  month[0] = "Jan";
  month[1] = "Feb";
  month[2] = "Mar";
  month[3] = "Apr";
  month[4] = "May";
  month[5] = "Jun";
  month[6] = "Jul";
  month[7] = "Aug";
  month[8] = "Sep";
  month[9] = "Oct";
  month[10] = "Nov";
  month[11] = "Dec";
  return month;
}
//}