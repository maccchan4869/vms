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

const maxDispNo = 10;

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
 * @param {object} staffs スタッフ情報
 */
 const getStaffOptions = (staffs) => {
  const ret = [];
  ret.push({uid: null, staffName: '全て'});
  staffs.forEach(staff => {
    ret.push({uid: staff.uid, staffName: staff.staffName});
  });
  return ret;
}

/**
 * 休暇の取得日数を取得
 * @param {datetime} startDatetime 開始時刻
 * @param {datetime} endDatetime   終了時刻
 */
 const getVacationDays = (startDatetime, endDatetime) => {
  const oneDay = 1;
  const halfDay = 0.5;
  let diffDay = endDatetime.getTime() - startDatetime.getTime();
  diffDay = Math.floor(diffDay / 86400000);
  // 日跨ぎ申請を考慮するため、終了時刻に日付を合わせる
  startDatetime.setDate(startDatetime.getDate() + diffDay);
  let diffTime = endDatetime.getTime() - startDatetime.getTime();
  // 1日の勤労時間（8時間）で除算し、休暇申請日数を求める
  diffTime = Math.floor(diffTime / 28800000);
  return (diffTime === 0 ? diffDay + halfDay : diffDay + oneDay);
}

/**
 * ページネーション
 * @param {object}  listItems    データリスト
 * @param {integer} nowPageIndex 現在のページ
 */
const pagingItems = (listItems, nowPageIndex) => {
  const firstIndex = (nowPageIndex - 1) * maxDispNo;
  const lastIndex = firstIndex + maxDispNo;
  const items = [];
  listItems.forEach((e, i) => {
    if (i < firstIndex || i >= lastIndex) return;
    items.push(e);
  })
  return items;
}

/**
 * ページネーションの最大値を取得
 * @param {integer} listLength リストの長さ
 */
 const getMaxPageIndex = (listLength) => {
  if (listLength <= maxDispNo) return 0;
  const isAddPage = listLength % maxDispNo !== 0;
  const maxIndex = Math.floor(listLength / maxDispNo);
  return isAddPage ? maxIndex + 1 : maxIndex;
}

export default { setTypeName, setStatusName, setDate, setTime, getCodeStatus, getCodeType, getThisYear, getYearOptions, getStaffOptions, getVacationDays, pagingItems, getMaxPageIndex };