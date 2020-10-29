var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BCWDq0e1GO1ObsHnAhDtyQYrgYjI3ybhNdCAkXf0ps_lcT6K9yp6caIrC98AtCvyxeARN0hdDFTd7nl3tVu7kYo",
   "privateKey": "T-hGSoEnd012BDwaprxMVwrvUNcIAzufCWRKdGbq1n8"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/cEQ1M43sILk:APA91bEvyufvijcbcwMoBoNn21IiFQrJBHpE-P9K7DJ39AyvMTFFZqnTsAAwvbfOdmVS4WnxLHsDDOOmCNYa8wjG0dTbC0hTRu1PSG-dXvZzEHIsLpduoCd6L9l4MjVWz4ViR8i37xTQ",
   "keys": {
       "p256dh": "BKv3cAHBUQnvtF1/JkQxyGv11aYlaS3d8h17kqgGeydE2lYpZP/VhSK8QU+dguKGSwBQvjnitSI8nYDonzKC7ww=",
       "auth": "L8JQCCMkU5gJLvkBBGJsYA=="
   }
};
var payload = 'Welcome to The Premiere League Info Website';
 
var options = {
   gcmAPIKey: '226684769668',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);