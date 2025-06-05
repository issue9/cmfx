// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import IconClose from '~icons/material-symbols/close';

/**
 * 表示图标组件的类型
 *
 * NOTE: 当图片位于 flex 容器中时，需要注意将其 flex-shrink 设置为 0，否则可能会使图标变小。
 */
export type IconComponent = typeof IconClose;

export type Props = Parameters<IconComponent>[0];

