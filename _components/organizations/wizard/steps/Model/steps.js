import categories from '../categories';
import company from '../company';
import plans from '../plans';
import themes from '../themes';
import terms from '../terms';
import register from '../register';
import {
    STEP_REGISTER,
    STEP_TERMS,
    STEP_COMPANY,
    STEP_CATEGORIES,
    STEP_THEMES,
    STEP_PLANS,
} from '@imagina/qsite/_components/organizations/wizard/steps/model/constant.js';



export default [
    {
        id: STEP_REGISTER,
        title: 'Register',
        prefix: STEP_REGISTER,
        component: register,
        done: false,
    },
    {
        id: STEP_TERMS,
        title: 'Terms',
        prefix: STEP_TERMS,
        component: terms,
        done: false,
    },
    {
        id: STEP_COMPANY,
        title: 'Company',
        prefix: STEP_COMPANY,
        component: company,
        done: false,
    },
    {
        id: STEP_CATEGORIES,
        title: 'Categories',
        prefix: STEP_CATEGORIES,
        component: categories,
        done: false,
    },
    {
        id: STEP_PLANS,
        title: 'Plans',
        prefix: STEP_PLANS,
        component: plans,
        done: false,
    },
    {
        id: STEP_THEMES,
        title: 'Themes',
        prefix: STEP_THEMES,
        component: themes,
        done: false,
    },
];