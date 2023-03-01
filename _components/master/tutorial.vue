<template></template>

<script>
export default {
    name: "Tutorial",
    watch: {
        $route (to, from){
            this.tutorial?.complete();
            if (!this.isTutorialWatched(this.$route.meta.path)) this.showTutorialByType(this.$route.meta.path)
        }
    },
    data() {
        return {
            tutorial: null,
        }
    },
    beforeDestroy() {
        this.$eventBus.$off('showTutorial')
    },
    mounted() {
        if (!this.isTutorialWatched(this.$route.meta.path)) this.showTutorialByType(this.$route.meta.path)
        this.$eventBus.$on('showTutorial', (typeTutorial) => {
            if (typeTutorial) this.showTutorialByType(typeTutorial)
        })
    },
    methods: {
        showTutorialByType(typeTutorial) {
            if (window.innerWidth < 1016) return;
            localStorage.setItem(typeTutorial, "true");
            this.tutorial = new Shepherd.Tour({
                defaultStepOptions: {
                    cancelIcon: {
                        enabled: true
                    },
                    scrollTo: { behavior: 'smooth', block: 'center' }
                },
                useModalOverlay: true,
            });
            const tutorial = this.tutorial;
            switch (typeTutorial) {
                case '/':
                    tutorial.addStep({
                        title: 'Perfil',
                        text: `En esta sección podrás cambiar tu correo, cambiar tu contraseña o cerrar sesión.`,
                        attachTo: {
                            element: "#profile-button",
                            on: 'bottom'
                        },
                        buttons: [
                            {
                                action() {
                                    return this.back();
                                },
                                classes: 'tour-secondary',
                                text: 'Atrás'
                            },
                            {
                                action() {
                                    return this.next();
                                },
                                classes: 'tour-primary',
                                text: 'Siguiente'
                            }
                        ],
                        id: 'creating'
                    });

                    tutorial.addStep({
                        title: 'Lista de actividades',
                        text: `Crea actividades, para que tus usuarios, puedan realizar acciones rápidas, como crear un producto, script personalizados etc, formularios, entre otros.`,
                        attachTo: {
                            element: "#activitiesComponent",
                            on: 'bottom'
                        },
                        buttons: [
                            {
                                action() {
                                    return this.back();
                                },
                                classes: 'tour-secondary',
                                text: 'Atrás'
                            },
                            {
                                action() {
                                    return this.next();
                                },
                                text: 'Siguiente',
                                classes: 'tour-primary',
                            }
                        ],
                        id: 'creating'
                    });

                    tutorial.addStep({
                        title: 'Productos por agotar',
                        text: `Puedes estar pendiente de los productos que están apunto de quedar sin stock`,
                        attachTo: {
                            element: "#quick-card-sold-out",
                            on: 'bottom'
                        },
                        buttons: [
                            {
                                action() {
                                    return this.back();
                                },
                                classes: 'tour-secondary',
                                text: 'Atrás'
                            },
                            {
                                action() {
                                    return this.next();
                                },
                                classes: 'tour-primary',
                                text: 'Siguiente'
                            }
                        ],
                        id: 'creating'
                    });

                    tutorial.addStep({
                        title: 'Últimas ordenes',
                        text: `Revisa el estado de las últimas ventas de tu tienda online.`,
                        attachTo: {
                            element: "#quick-card-last-orders",
                            on: 'bottom'
                        },
                        buttons: [
                            {
                                action() {
                                    return this.back();
                                },
                                classes: 'tour-secondary',
                                text: 'Atrás'
                            },
                            {
                                action() {
                                    return this.next();
                                },
                                text: 'Siguiente',
                                classes: 'tour-primary',
                            }
                        ],
                        id: 'creating'
                    });

                    tutorial.addStep({
                        title: 'Últimas publicaciones',
                        text: `Revisa el cuáles fueron de tus últimas publicaciones, crea otra, edita o elimina.`,
                        attachTo: {
                            element: "#quick-card-last-posts",
                            on: 'bottom'
                        },
                        buttons: [
                            {
                                action() {
                                    return this.back();
                                },
                                classes: 'tour-secondary',
                                text: 'Atrás'
                            },
                            {
                                action() {
                                    return this.next();
                                },
                                text: 'Siguiente',
                                classes: 'tour-primary',
                            }
                        ],
                        id: 'creating'
                    });

                    tutorial.addStep({
                        title: 'Menú Lateral',
                        text: `Aquí podrás encontrar las diferentes categorias y acciones, para poder crear usuarios, formularios, productos, etc...`,
                        attachTo: {
                            element: "#listMenu",
                            on: 'right-start'
                        },
                        buttons: [
                            {
                                action() {
                                    return this.back();
                                },
                                classes: 'tour-secondary',
                                text: 'Atrás'
                            },
                            {
                                action() {
                                    return this.next();
                                },
                                text: 'Siguiente',
                                classes: 'tour-primary',
                            }
                        ],
                        id: 'creating'
                    });

                    tutorial.addStep({
                        title: 'Ajustes',
                        text: `Aquí encontrar todas las configuraciones de tu sitio web, tal como modulos, configuraciones avanzadas, aws, etc...`,
                        attachTo: {
                            element: document.querySelector("#listMenu").lastElementChild,
                            on: 'right-start'
                        },
                        buttons: [
                            {
                                action() {
                                    return this.back();
                                },
                                classes: 'tour-secondary',
                                text: 'Atrás'
                            },
                            {
                                action() {
                                    return this.next();
                                },
                                text: 'Siguiente',
                                classes: 'tour-primary',
                            }
                        ],
                        id: 'creating'
                    });
                    break;
                case '/blog/posts/index':
                    tutorial.addStep({
                        title: 'Entrdas de Blog',
                        text: `En esta sección podrás eliminar, actualizar o crear nuevas entradas para tu blog.`,
                        attachTo: {
                            element: "#componentCrudIndex",
                            on: 'bottom'
                        },
                        buttons: [
                            {
                                action() {
                                    return this.back();
                                },
                                classes: 'tour-secondary',
                                text: 'Atrás'
                            },
                            {
                                action() {
                                    return this.next();
                                },
                                classes: 'tour-primary',
                                text: 'Siguiente'
                            }
                        ],
                        id: 'creating'
                    });
                    tutorial.addStep({
                        title: 'Crear nueva entrada.',
                        text: `Podrás crear una nueva entrada haciendo click en este botón.`,
                        attachTo: {
                            element: "#new-button-crud",
                            on: 'bottom'
                        },
                        buttons: [
                            {
                                action() {
                                    return this.back();
                                },
                                classes: 'tour-secondary',
                                text: 'Atrás'
                            },
                            {
                                action() {
                                    return this.next();
                                },
                                classes: 'tour-primary',
                                text: 'Siguiente'
                            }
                        ],
                        id: 'creating'
                    });

                    tutorial.addStep({
                        title: 'Cambia la vista de la tabla',
                        text: `Aquí podrás cambiar la vista de la tabla, y ver mejor tus entradas`,
                        attachTo: {
                            element: "#view-button-crud",
                            on: 'bottom'
                        },
                        buttons: [
                            {
                                action() {
                                    return this.back();
                                },
                                classes: 'tour-secondary',
                                text: 'Atrás'
                            },
                            {
                                action() {
                                    return this.next();
                                },
                                classes: 'tour-primary',
                                text: 'Siguiente'
                            }
                        ],
                        id: 'creating'
                    });

                    tutorial.addStep({
                        title: 'Filtra tus entradas.',
                        text: `En esta sección podrás filtrar tus entradas por categoria.`,
                        attachTo: {
                            element: "#filter-button-crud",
                            on: 'bottom'
                        },
                        buttons: [
                            {
                                action() {
                                    return this.back();
                                },
                                classes: 'tour-secondary',
                                text: 'Atrás'
                            },
                            {
                                action() {
                                    return this.next();
                                },
                                classes: 'tour-primary',
                                text: 'Siguiente'
                            }
                        ],
                        id: 'creating'
                    });

                    tutorial.addStep({
                        title: 'Actualiza tus entradas.',
                        text: `Aquí podrás hacer click, para obtener la información más reciente sobre tus entradas.`,
                        attachTo: {
                            element: "#refresh-button-crud",
                            on: 'bottom'
                        },
                        buttons: [
                            {
                                action() {
                                    return this.back();
                                },
                                classes: 'tour-secondary',
                                text: 'Atrás'
                            },
                            {
                                action() {
                                    return this.next();
                                },
                                classes: 'tour-primary',
                                text: 'Siguiente'
                            }
                        ],
                        id: 'creating'
                    });

                    tutorial.addStep({
                        title: 'Páginación de entradas.',
                        text: `Aquí podrás navegar y mostrar el resto de tus estradas, por defecto solo se muestran 10 entradas y puedes cambiarlo en selector que está a la derecha.`,
                        attachTo: {
                            element: "#crudPaginationComponent",
                            on: 'bottom'
                        },
                        buttons: [
                            {
                                action() {
                                    return this.back();
                                },
                                classes: 'tour-secondary',
                                text: 'Atrás'
                            },
                            {
                                action() {
                                    return this.next();
                                },
                                classes: 'tour-primary',
                                text: 'Siguiente'
                            }
                        ],
                        id: 'creating'
                    });
                    break;
                case '/site/settings':
                    //Tour Settings
                    tutorial.addStep({
                        title: 'Páginas de Ajustes',
                        text: `Aquí realizar ajustes avanzados a tu sitio web y a los diferentes modulos que este contiene.`,
                        attachTo: {
                            element: "#settingPage",
                            on: 'bottom'
                        },
                        buttons: [
                            {
                                action() {
                                    return this.back();
                                },
                                classes: 'tour-secondary',
                                text: 'Atrás'
                            },
                            {
                                action() {
                                    return this.next();
                                },
                                classes: 'tour-primary',
                                text: 'Siguiente'
                            }
                        ],
                        id: 'creating'
                    });

                    tutorial.addStep({
                        title: 'Modulos',
                        text: `Aquí podrás encontrar los diferentes modulos que hay en tu sitio web, con ello podrás modificarlos a tus necesidades.`,
                        attachTo: {
                            element: "#menuContent",
                            on: 'right-start'
                        },
                        buttons: [
                            {
                                action() {
                                    return this.back();
                                },
                                classes: 'tour-secondary',
                                text: 'Atrás'
                            },
                            {
                                action() {
                                    return this.next();
                                },
                                classes: 'tour-primary',
                                text: 'Siguiente'
                            }
                        ],
                        id: 'creating'
                    });
                    break;

                default:
                    return;
            }
            tutorial.start();
        },
        isTutorialWatched(typeTutorial){
            const isWatched = localStorage.getItem(typeTutorial);
            if (isWatched) {
                return true;
            }else{
                return false;
            }
            
        }
    }
}
</script>

<style>
    .shepherd-header{
        background-color: #f3f3f3 !important;
        padding: 0 1rem !important;
    }
    .tour-primary {
        background-color: #17a2b8 !important;
        color: #ffffff !important;
        padding: 0.5rem 1rem !important;
    }
    .tour-secondary  {
        background-color: #f3f3f3 !important;
        color: rgba(0,0,0,.75) !important;
    }
</style>