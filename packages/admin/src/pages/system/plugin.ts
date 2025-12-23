// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 通过插件注入的全局变量名称
 */
export const aboutName = '__CMFX_ADMIN_ABOUT__';

/**
 * 每个依赖包的信息
 */
export interface Package {
    /**
     * 包名称
     */
    name: string;

    /**
     * 包的版本号
     */
    version: string;
}

/**
 * 关于页面的数据
 */
export interface About {
    /**
     * 前端的生产环境依赖列表
     */
    dependencies: Array<Package>;

    /**
    * 前端的开发环境依赖列表
    */
    devDependencies: Array<Package>;

    /**
     * 后端的依赖列表
     */
    serverDependencies: Array<Package>;

    /**
     * 软件版本
     */
    version: string;
}
