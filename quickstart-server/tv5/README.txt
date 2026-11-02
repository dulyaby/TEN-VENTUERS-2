TEN VENTURES AFRICA - static website + Firebase (Auth + Firestore)

1) DEPLOY: drag this folder to https://app.netlify.com/drop (or Cloudflare Pages / Firebase Hosting).
2) FIREBASE CONSOLE (project: tenventure-africa):
   - Authentication > Sign-in method: enable Email/Password and Google.
   - Authentication > Settings > Authorized domains: add your Netlify domain.
   - Firestore Database: create the database, then paste firebase/firestore.rules in the Rules tab and Publish.
   - FIRST ADMIN: sign up on the site, copy that user's UID (Authentication > Users),
     then in Firestore create collection "admins" with a document whose ID is that UID (any field).
3) PREVIEW WITHOUT BACKEND: open any page with ?demo=1 (data stays in your browser). Demo admin: admin@tenventures.demo / admin123. Use ?demo=0 to switch back.
4) Images are shrunk in the browser and CVs are limited to 600 KB, so no paid Firebase Storage is needed and pages stay light on weak networks.
5) Night mode: moon button (top right). Lite mode starts automatically on slow/2G or Data Saver connections.
