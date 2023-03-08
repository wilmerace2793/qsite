const crudBlogSteps = [
    {
        title: 'Entrdas de Blog',
        icon: 'fas fa-info',
        content: 'En esta sección podrás eliminar, actualizar o crear nuevas entradas para tu blog.',
        element: '#componentCrudIndex',
        position: 'bottom',
    },
    {
        title: 'Crear nueva entrada',
        icon: 'fas fa-info',
        content: 'Podrás crear una nueva entrada haciendo click en este botón.',
        element: '#new-button-crud',
        position: 'bottom',
    },
    {
        title: 'Cambia la vista de la tabla',
        icon: 'fas fa-info',
        content: 'Aquí podrás cambiar la vista de la tabla, y ver mejor tus entradas.',
        element: '#view-button-crud',
        position: 'bottom',
    },
    {
        title: 'Filtra tus entradas.',
        icon: 'fas fa-info',
        content: 'En esta sección podrás filtrar tus entradas por categoria.',
        element: '#filter-button-crud',
        position: 'bottom',
    },
    {
        title: 'Actualiza tus entradas.',
        icon: 'fas fa-info',
        content: 'Aquí podrás hacer click, para obtener la información más reciente sobre tus entradas.',
        element: '#refresh-button-crud',
        position: 'bottom',
    },
    {
        title: 'Páginación de entradas.',
        icon: 'fas fa-info',
        content: 'Aquí podrás navegar y mostrar el resto de tus estradas, por defecto solo se muestran 10 entradas y puedes cambiarlo en selector que está a la derecha.',
        element: '#crudPaginationComponent',
        position: 'bottom',
    },
];

export default {
    "/blog/posts/index": crudBlogSteps
}