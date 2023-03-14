import categories from '../categories';
import company from '../company';
import plans from '../plans';
import themes from '../themes';
import terms from '../terms';
import register from '../register';

export default [
    /*{
        id: 1,
        title: 'Register',
        prefix: 1,
        component: register,
        done: false,
    },*/
    {
        id: 2,
        title: 'Terms',
        prefix: 2,
        component: terms,
        done: false,
    },
    {
        id: 3,
        title: 'Company',
        prefix: 3,
        component: company,
        done: false,
    },
    {
        id: 4,
        title: 'Categories',
        prefix: 4,
        component: categories,
        done: false,
    },
    {
        id: 5,
        title: 'Themes',
        prefix: 5,
        component: themes,
        done: false,
    },
    {
        id: 6,
        title: 'Plans',
        prefix: 6,
        component: plans,
        done: false,
    },
];