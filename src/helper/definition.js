const codeType = {
  oneDay: {typeCd: '0', typeName: '有給休暇'},
  halfDay: {typeCd: '1', typeName: '半休休暇'},
  leaveEarly: {typeCd: '2', typeName: '早退'},
  absence: {typeCd: '3', typeName: '欠勤'}
};

const codeStatus = {
  applying: {statusCd: '0', statusName: '申請中'},
  approved: {statusCd: '1', statusName: '承認済み'},
  rejected: {statusCd: '2', statusName: '却下'},
  acquired: {statusCd: '3', statusName: '取得済み'},
};

/**
 * 休暇申請種別名を取得
 * 
 * @param {string} typeCd 休暇申請種別CD
 */
const setTypeName = (typeCd) => {
  switch (typeCd) {
    case codeType.oneDay.typeCd:
      return codeType.oneDay.typeName;
    case codeType.halfDay.typeCd:
      return codeType.halfDay.typeName;
    case codeType.leaveEarly.typeCd:
      return codeType.leaveEarly.typeName;
    case codeType.absence.typeCd:
      return codeType.absence.typeName;
    default:
      return '';
  }
};

/**
 * 申請状態名を取得
 * 
 * @param {string} statusCd 申請状態CD
 */
 const setStatusName = (statusCd) => {
  switch (statusCd) {
    case codeStatus.applying.statusCd:
      return codeStatus.applying.statusName;
    case codeStatus.approved.statusCd:
      return codeStatus.approved.statusName;
    case codeStatus.rejected.statusCd:
      return codeStatus.rejected.statusName;
    case codeStatus.acquired.statusCd:
      return codeStatus.acquired.statusName;
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

/**
 * 申請状態CDを取得
 */
const getCodeStatus = () => {
  return codeStatus;
};

/**
 * 申請状態CDを取得
 */
const getCodeType = () => {
  return codeType;
};

/**
 * 本年度を取得
 */
const getThisYear = () => {
  const today = new Date();
  today.setMonth(today.getMonth() - 3);
  return today.getFullYear();
}

/**
 * 年度の選択肢を取得
 */
 const getYearOptions = () => {
  const ret = [];
  const thisYear = getThisYear();
  for(let i = 2018; i <= thisYear; i++) {
    ret.push({value: i, dispValue: `${i}年度`});
  }
  return ret;
}

/**
 * スタッフの選択肢を取得
 */
 const getStaffOptions = (staffs) => {
  const ret = [];
  ret.push({uid: null, staffName: '全て'});
  staffs.forEach(staff => {
    ret.push({uid: staff.uid, staffName: staff.staffName});
  });
  return ret;
}

export default { setTypeName, setStatusName, setDate, setTime, getCodeStatus, getCodeType, getThisYear, getYearOptions, getStaffOptions };