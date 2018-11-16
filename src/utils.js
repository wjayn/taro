const formatTime = date => {
  const time=new Date(date);
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n
};

const formatLast4Number = (number) => {
  if (!number)
    return number;
  if (typeof number === 'number'){
    number = number.toString()
  }
  return number.replace(/(\d{3})\d{4}(\d{4})/,'****$2')
};

export default {
  formatTime,
  formatLast4Number
}
