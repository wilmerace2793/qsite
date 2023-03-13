import categories from '../categories';
import company from '../company';
import plans from '../plans';
import themes from '../themes';
import terms from '../terms';

export default [
    {
        id: 1,
        title: 'Terms',
        prefix: 1,
        component: terms,
        done: false,
    },
    {
        id: 2,
        title: 'Company',
        prefix: 2,
        component: company,
        done: false,
    },
    {
        id: 3,
        title: 'Categories',
        prefix: 3,
        component: categories,
        done: false,
    },
    {
        id: 4,
        title: 'Themes',
        prefix: 4,
        component: themes,
        done: false,
    },
    {
        id: 5,
        title: 'Plans',
        prefix: 5,
        component: plans,
        done: false,
    },
];