/**
 * Servicio para manejar notificaciones del sistema (Push/Web Notifications)
 */

export const solicitarPermisoNotificaciones = async () => {
  if (!("Notification" in window)) {
    console.log("Este navegador no soporta notificaciones de escritorio");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const enviarNotificacionPuntos = async (puntos, motivo) => {
  const tienePermiso = await solicitarPermisoNotificaciones();
  
  if (tienePermiso) {
    const options = {
      body: `¡Has ganado ${puntos} puntos por: ${motivo}! 🦷✨`,
      icon: '/vite.svg', // Puedes poner un icono de una muelita aquí
      badge: '/vite.svg',
      vibrate: [200, 100, 200],
      tag: 'puntos-muelitas',
      renotify: true
    };

    new Notification("¡Muelitas: Nuevos Puntos! 🎉", options);
  }
};
