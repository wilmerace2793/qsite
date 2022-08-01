import Vue from "vue";
import { reactive } from '@vue/composition-api';
import baseService from '@imagina/qcrud/_services/baseService.js';

const data = {
    title: "Layouts",
    description: "Layouts",
    name: "Layouts",
    fields: {
        layaout: {
            type: 'fileList',
            colClass: "col-12",
            files: {
                ref: 'otherFilesComponent',
                key: 'otherFiles',
                title: null,
                allowPagination: true,
                allowChangeView: true,
                allowSelect: 1,
                gridColClass: 'col-6 col-md-3 col-lg-4',
                value: [],
            }
        }
    }
};
const state = reactive({
    layoutList: { ...data },
    selectedlayoutId: null,
});

export default function layoutStore() {
    function getPrototype() {
        return Vue.prototype;
    }
    function getLayouts() {
        const requestParams = {
            refresh: true,
        }
        //Request
        baseService.index('apiRoutes.qsite.layouts', requestParams).then(response => {
            state.layoutList.fields.layaout.files.title = getPrototype().$trp('isite.cms.label.file');
            state.layoutList.fields.layaout.files.value = response.data.map((item) => ({ ...item.mediaFiles.mainimage }));
        }).catch(error => {
            state.layoutList.fields.layaout.files.value = [];
            console.log(error);
        })
    }
    function getLayoutsList() {
        return state.layoutList;
    }
    function setSelectedLayout(layaoutId) {
        state.selectedlayoutId = layaoutId;
    }
    function getSelectedLayout() {
        return state.selectedlayoutId;
    }
    return {
        getLayouts,
        getLayoutsList,
        getSelectedLayout,
        setSelectedLayout,
    }
}