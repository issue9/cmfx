// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// 确保被当作模块处理
export { };

declare module 'vue-router' {
    interface RouteMeta {
        public?: boolean // 该接口是否可在未登录的情况下访问
    }
}
