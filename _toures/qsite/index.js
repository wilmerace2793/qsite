const homeSteps = [
    {
        title: 'Perfil',
        icon: 'fas fa-info',
        content: 'En esta sección podrás cambiar tu correo, cambiar tu contraseña o cerrar sesión.',
        element: '#profile-button',
        position: 'bottom',
    },
    {
        title: 'Productos por agotar',
        icon: 'fas fa-info',
        content: 'Puedes estar pendiente de los productos que están apunto de quedar sin stock.',
        element: '#quick-card-sold-out',
        position: 'bottom',
    },
    {
        title: 'Últimas ordenes',
        icon: 'fas fa-info',
        content: 'Revisa el estado de las últimas ventas de tu tienda online.',
        element: '#quick-card-last-orders',
        position: 'bottom',
    },
    {
        title: 'Últimas publicaciones',
        icon: 'fas fa-info',
        content: 'Revisa el cuáles fueron de tus últimas publicaciones, crea otra, edita o elimina.',
        element: '#quick-card-last-posts',
        position: 'bottom',
    },
    {
        title: 'Menú Lateral',
        icon: 'fas fa-info',
        content: 'Aquí podrás encontrar las diferentes categorias y acciones, para poder crear usuarios, formularios, productos, etc...',
        element: '#listMenu',
        position: 'right-start',
    },
    {
        title: 'Ajustes',
        icon: 'fas fa-info',
        content: 'Aquí encontrar todas las configuraciones de tu sitio web, tal como modulos, configuraciones avanzadas, aws, etc...',
        element: '#menuItem-appsitesettings',
        position: 'right-start',
    },
];

const settingsSteps = [
    {
        title: 'Páginas de Ajustes',
        icon: 'fas fa-info',
        content: 'Aquí realizar ajustes avanzados a tu sitio web y a los diferentes modulos que este contiene.',
        element: '#settingPage',
        position: 'bottom',
    },
    {
        title: 'Modulos',
        icon: 'fas fa-info',
        content: 'Aquí podrás encontrar los diferentes modulos que hay en tu sitio web, con ello podrás modificarlos a tus necesidades.',
        element: '#menuContent',
        position: 'right-start',
    },
];

export default {
    "/": homeSteps,
    "/site/settings": settingsSteps
}