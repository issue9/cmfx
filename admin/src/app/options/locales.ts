// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Locale } from '@/locales';

export interface Locales<T = object> {
    /**
     * 加载项目本地化内容的函数
     */
    loader: { (locale: Locale): Promise<T> }

    /**
     * 支持的语言
     *
     * 这将从 dir 中加载相应的翻译文件。请确保这些文件是否真的存在。
     */
    locales: Array<Locale>

    /**
     * 在找不到语言时的默认项
     */
    fallback: Locale
}
