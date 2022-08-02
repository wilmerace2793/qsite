import Vue from "vue";
import { reactive } from '@vue/composition-api';
import baseService from '@imagina/qcrud/_services/baseService.js';

const data = {
    title: "Layouts",
    description: null,
    name: "Layouts",
    fields: {
        layoutId: {
            type: 'fileList',
            colClass: "col-12",
            files: {
                ref: 'otherFilesComponent',
                key: 'otherFiles',
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
            setSelectedFile();
            state.layoutList.fields.layoutId.files.value = mapLayoutsList(response.data);
        }).catch(error => {
            state.layoutList.fields.layoutId.files.value = [];
            console.log(error);
        })
    }
    function setSelectedFile() {
        state.layoutList.fields.layoutId.files.selectedFile = getSelectedLayout();
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
    function mapLayoutsList(data) {
        return data.map((item) => { 
            return {
                id: item.id,
                filename: item.title,
                createdAt: item.createdAt,
                path: item.mediaFiles.mainimage.path,
                isFolder: item.mediaFiles.mainimage.isFolder,
                isImage: item.mediaFiles.mainimage.isImage,
                isVideo: item.mediaFiles.mainimage.isVideo,
                largeThumb: item.mediaFiles.mainimage.largeThumb,
                mediaType: item.mediaFiles.mainimage.mediaType,
                mediumThumb: item.mediaFiles.mainimage.mediumThumb,
                mimeType: item.mediaFiles.mainimage.mimeType,
            }
       });
    }
    return {
        getLayouts,
        getLayoutsList,
        getSelectedLayout,
        setSelectedLayout,
        setSelectedFile
    }
}