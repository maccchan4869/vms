const codeType = {
  oneDay: '0',
  halfDay: '1'
};

const codeStatus = {
  applying: '0',
  approved: '1',
  rejected: '2',
  acquired: '3'
};

/**
 * 休暇申請種別名を取得
 * 
 * @param {string} typeCd 休暇申請種別CD
 */
const setTypeName = (typeCd) => {
  switch (typeCd) {
    case codeType.oneDay:
      return '有給休暇';
    case codeType.halfDay:
      return '半日休暇';
    default:
      return 'その他';
  }
};

/**
 * 申請状態名を取得
 * 
 * @param {string} statusCd 申請状態CD
 */
 const setStatusName = (statusCd) => {
  switch (statusCd) {
    case codeStatus.applying:
      return '申請中';
    case codeStatus.approved:
      return '承認済み';
    case codeStatus.rejected:
      return '却下中';
    case codeStatus.acquired:
      return '取得済み';
    default:
      return '';
  }
};

/**
 * 時刻から日付を取得
 * 
 * @param {datetime} datetime 時刻
 */
const setDate = (datetime) => {
  let format = 'YYYY年MM月DD日'
  format = format.replace(/YYYY/, datetime.getFullYear());
  format = format.replace(/MM/, ('0' + (datetime.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/, ('0' + datetime.getDate()).slice(-2));
  return format;
};

/**
 * 時刻から時間を取得
 * 
 * @param {datetime} datetime 時刻
 */
const setTime = (datetime) => {
  let format = 'hh:mm';
  format = format.replace(/hh/, ('0' + datetime.getHours()).slice(-2));
  format = format.replace(/mm/, ('0' + datetime.getMinutes()).slice(-2));
  return format;
};

export default { setTypeName, setStatusName, setDate, setTime };