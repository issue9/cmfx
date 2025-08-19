// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import './style.css';

// TODO: safari 支持 requestIdleCallback，后期可删除。
// https://caniuse.com/?search=requestIdleCallback
window.requestIdleCallback = window.requestIdleCallback ||
    function (cb) {
        var start = Date.now();
        return setTimeout(function () {
            cb({
                didTimeout: false,
                timeRemaining: function () {
                    return Math.max(0, 50 - (Date.now() - start));
                },
            });
        }, 1);
    };

export * from './appbar';
export * from './backtop';
export * from './badge';
export * from './base';
export * from './button';
export * from './card';
export * from './chart';
export * from './code';
export * from './context';
export * from './datetime';
export * from './dialog';
export * from './divider';
export * from './drawer';
export * from './empty';
export * from './form';
export * from './icon';
export * from './illustrations';
export * from './kit';
export * from './menu';
export * from './messages';
export * from './notify';
export * from './page';
export * from './pagination';
export * from './qrcode';
export * from './result';
export * from './spin';
export * from './statistics';
export * from './tab';
export * from './table';
export * from './theme';
export * from './tooltip';
export * from './typography';
export * from './wizard';

