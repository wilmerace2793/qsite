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
    STEP_CATEGORY,
    STEP_THEMES,
    STEP_PLANS,
    infoMappings,
  } from '@imagina/qsite/_components/organizations/wizard/steps/Model/constant.js';

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
        id: STEP_COMPANY ,
        title: 'Company',
        prefix: STEP_COMPANY,
        component: company,
        done: false,
    },
    {
        id: STEP_CATEGORY,
        title: 'Categories',
        prefix: STEP_CATEGORY,
        component: categories,
        done: false,
    },
    {
        id: STEP_THEMES,
        title: 'Themes',
        prefix: STEP_THEMES,
        component: themes,
        done: false,
    },
    {
        id: STEP_PLANS,
        title: 'Plans',
        prefix: STEP_PLANS,
        component: plans,
        done: false,
    },
];