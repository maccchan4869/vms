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

exports.updateApplyStatusCd = functions.pubsub
    .schedule("0 0 * * *")
    .timeZone("Asia/Tokyo")
    .onRun((context) => {
      const today = new Date();
      // リージョン設定による時差を修正
      today.setHours(today.getHours() + 9);
      db.collection("vacation")
          .where("applyStatusCd", "==", codeStatus.approved.statusCd).get()
          .then((querySnapshot) => {
            const vacation = [];
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
              console.log("*** success *** update ***");
            }).catch((error) => {
              console.log("*** failure *** update ***");
            });
          }).catch((error) => {
            console.log("*** failure *** update ***");
          });
      return 0;
    });

exports.addVacation = functions.pubsub
    .schedule("0 0 * * *")
    .timeZone("Asia/Tokyo")
    .onRun((request, response) => {
      const today = new Date();
      // リージョン設定による時差を修正
      today.setHours(today.getHours() + 9);
      const todayStart = new Date(
          today.getFullYear(), today.getMonth(), today.getDate());
      const todayEnd = new Date(
          today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
      db.collection("users")
          .where("admin", "==", false).get()
          .then((querySnapshot) => {
            const staff = [];
            querySnapshot.forEach((doc) => {
              // 休暇付与日が本日のユーザー情報を取得
              const addVacationDay = doc.get("addVacationDay").toDate();
              addVacationDay.setHours(addVacationDay.getHours() + 9);
              if (addVacationDay < todayStart || addVacationDay > todayEnd) {
                return;
              }
              // 休暇付与後の残休暇日数を算出
              let daysLeft = doc.get("daysLeft");
              const addVacationDayYear = addVacationDay.getFullYear();
              const todayYear = today.getFullYear();
              const workLength = addVacationDayYear - todayYear;
              if (workLength === 0) {
                daysLeft += 10;
              } else if (workLength === 1) {
                daysLeft += 11;
              } else if (workLength === 2) {
                daysLeft += 12;
              } else {
                daysLeft += 20;
              }
              // 更新情報を生成
              addVacationDay.setFullYear(addVacationDayYear + 1);
              addVacationDay.setHours(today.getHours() - 9);
              staff.push({
                uid: doc.get("uid"),
                daysLeft: daysLeft,
                addVacationDay: addVacationDay,
              });
            });
            const batch = db.batch();
            staff.forEach((e) => {
              const userRef = db.collection("users").doc(e.uid);
              batch.update(userRef,
                  {"daysLeft": e.daysLeft});
              batch.update(userRef,
                  {"addVacationDay": e.addVacationDay});
            });
            batch.commit().then(() => {
              console.log("*** success *** update ***");
            }).catch((error) => {
              console.log("*** failure *** update ***");
            });
          }).catch((error) => {
            console.log("*** failure *** update ***");
          });
      return 0;
    });
