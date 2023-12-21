import {openURL, uid} from "quasar";
import Vue from 'vue';

declare module 'vue/types/vue' {
  export interface Vue {
    $alert: any,
    $array: any[],
    $date: any,
    $helper: any,
    $cache: any,
    $lodash: any,
    $remember: any,
    $tour: any,
    $hook: any,
    $notification: any,
    $clone: (dataToClone: any) => {},
    $crud: any,
    $openUrl: typeof openURL,
    $eventBus: any,
    $filter: any,
    $uid: typeof uid,
    $tr: any
  }
}