import firebase from 'firebase'

/**
 * メール送信
 * @param {object} param 送信先情報
 */
const sendMail = (param) => {
  try {
    const sendMail = firebase.functions().httpsCallable('sendMail');
    sendMail({destination: param.destination, subject: param.subject, text: param.text});
  }
  catch {
    console.log('faild');
  }
}

/**
 * スタッフへメールを送信する
 * @param {object} param 送信先情報
 */
 const sendMailToStaff = (param) => {
  try {
    const sendMail = firebase.functions().httpsCallable('sendMail');
    sendMail({destination: param.destination, subject: param.subject, text: param.text});
    console.log('success');
  }
  catch {
    console.log('faild');
  }
}

/**
 * 管理者へメールを送信する
 * @param {object} param 送信先情報
 */
 const sendMailToAdministrator = (param) => {
  try {
    const sendMail = firebase.functions().httpsCallable('sendMail');
    param.destinations.forEach(e => {
      sendMail({destination: e.destination, subject: param.subject, text: param.text});
    });
    console.log('success');
  }
  catch {
    console.log('faild');
  }
}

export default { sendMail, sendMailToStaff, sendMailToAdministrator };
