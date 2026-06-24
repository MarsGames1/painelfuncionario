// WexioLead — Service Worker
// Responsável por notificações do relatório diário (e push futuro)

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Push do servidor (pipeline futuro com VAPID). Mostra a notificação recebida.
self.addEventListener('push', (event) => {
  let payload = { title: 'WexioLead', body: 'Você tem um lembrete.', url: '/' };
  try {
    if (event.data) {
      const d = event.data.json();
      payload = Object.assign(payload, d);
    }
  } catch (e) {
    if (event.data) payload.body = event.data.text();
  }
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon || 'wexavatar.png',
      badge: payload.badge || 'wexavatar.png',
      tag: payload.tag || 'relatorio-dia',
      requireInteraction: false,
      data: { url: payload.url || '/' }
    })
  );
});

// Clicar na notificação foca/abre o painel
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
