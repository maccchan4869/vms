import firebase from 'firebase'

/**
 * 休暇の取得日数を取得
 * @param {object} param 送信先情報
 */
const sendMail= (param) => {
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
