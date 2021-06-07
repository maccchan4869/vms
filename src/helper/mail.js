import firebase from 'firebase'

/**
 * メール送信
 * @param {object} param 送信先情報
 */
const sendMail = (param) => {
  try {
    const sendMail = firebase.functions().httpsCallable('sendMail');
    sendMail({destination: param.destination, subject: param.subject, text: param.text});
    console.log('success');
  }
  catch {
    console.log('faild');
  }
}

export default { sendMail };
