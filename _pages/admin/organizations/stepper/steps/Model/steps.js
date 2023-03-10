import categories from '../categories';
import company from '../company';
import plans from '../plans';
import themes from '../themes';

export default [
    {
        id: 1,
        title: 'Plans',
        prefix: 1,
        component: plans,
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
];