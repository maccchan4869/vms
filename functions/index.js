// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
// データベースの参照を作成
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
// メールサーバーの設定
const nodemailer = require("nodemailer");
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});
const codeStatus = {
  applying: {statusCd: "0", statusName: "申請中"},
  approved: {statusCd: "1", statusName: "承認済み"},
  rejected: {statusCd: "2", statusName: "却下"},
  acquired: {statusCd: "3", statusName: "取得済み"},
};

exports.sendMail = functions.https.onCall((data, context) => {
  const email = {
    from: gmailEmail,
    to: data.destination,
    subject: data.subject,
    text: data.text,
  };
  mailTransport.sendMail(email, (err, info) => {
    if (err) {
      return console.log(err);
    }
    return console.log("success");
  });
});

exports.updateApplyStatusCd = functions.https.onRequest((request, response) => {
  const today = new Date();
  // リージョン設定による時差を修正
  today.setHours(today.getHours() + 9);
  const vacation = [];
  db.collection("vacation")
      .where("applyStatusCd", "==", codeStatus.approved.statusCd).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((vacationDoc) => {
          if (vacationDoc.get("endDatetime").toDate() >= today) {
            return;
          }
          vacation.push({
            uid: vacationDoc.get("uid"),
            vacationId: vacationDoc.get("vacationId"),
          });
        });
        const batch = db.batch();
        vacation.forEach((e) => {
          const vacListRef = db.collection("vacation").doc(e.vacationId);
          const vacRef = db.collection("vacation").doc(e.uid)
              .collection("vacationId").doc(e.vacationId);
          batch.update(vacRef,
              {"applyStatusCd": codeStatus.acquired.statusCd});
          batch.update(vacListRef,
              {"applyStatusCd": codeStatus.acquired.statusCd});
        });
        batch.commit().then(() => {
          response.send("*** success *** update ***");
        }).catch((error) => {
          response.send("*** failure *** update ***");
        });
      }).catch((error) => {
        response.send("*** failure *** update ***");
      });
});
