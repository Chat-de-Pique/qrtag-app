// ── Firebase Messaging Service Worker ──
// Ce fichier DOIT être à la racine du site (même niveau que index.html)
// Il s'exécute en arrière-plan même quand l'appli est fermée.

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAJXkf2hztEQ_rb-u1iISHl5zwzwuwQS5E",
  authDomain: "qrtag-6e1f7.firebaseapp.com",
  projectId: "qrtag-6e1f7",
  storageBucket: "qrtag-6e1f7.firebasestorage.app",
  messagingSenderId: "901346334115",
  appId: "1:901346334115:web:a91feef09e591721637616"
});

const messaging = firebase.messaging();

// Notification reçue quand l'app est en arrière-plan ou fermée
messaging.onBackgroundMessage(payload => {
  const title = payload.notification?.title || '🏷️ QRTag';
  const body  = payload.notification?.body  || 'Quelqu\'un a scanné ton profil !';

  self.registration.showNotification(title, {
    body,
    icon:    '/icon-192.png',
    badge:   '/icon-192.png',
    vibrate: [200, 100, 200],
    tag:     'qrtag-scan',          // remplace la notif précédente au lieu d'empiler
    renotify: true,
    data: payload.data || {},
    actions: [
      { action: 'open',    title: '👁 Voir mon profil' },
      { action: 'dismiss', title: 'Fermer' }
    ]
  });
});

// Clic sur la notification → ouvre l'appli
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // Si l'appli est déjà ouverte, on la met au premier plan
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Sinon on ouvre un nouvel onglet
      return clients.openWindow('/');
    })
  );
});
