import admin from "firebase-admin"

var serviceAccount = JSON.parse(
  Buffer.from(process.env.NEXT_PUBLIC_SERVICE_ACCOUNT, "base64").toString()
)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

export default admin
