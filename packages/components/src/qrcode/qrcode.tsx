// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import QRCodeStyling, {
    CornerDotType, CornerSquareType, DotType, ErrorCorrectionLevel, FileExtension, Options
} from 'qr-code-styling';
import { createEffect, createSignal, JSX, mergeProps, onMount } from 'solid-js';

import { BaseProps, joinClass } from '@/base';
import styles from './style.module.css';

export interface Ref {
    /**
     * 提供下载图片的功能
     */
    download(name?: string, ext?: FileExtension): Promise<void>;
}

export interface Props extends BaseProps {
    /**
     * 需要生成图片的值
     *
     * 根据 {@link "type"} 的不同，对值的要求也是不同的。
     */
    value: string;

    /**
     * 默认为值 M
     */
    errorCorrectionLevel?: ErrorCorrectionLevel,

    /**
     * 二维码的类型
     */
    type?: DotType;

    /**
     * 定位框外框的类型
     */
    cornerSquareType?: CornerSquareType;

    /**
     * 定位框内部元素的类型
     */
    cornerDotType?: CornerDotType;

    /**
     * 宽度，默认 200。
     */
    width?: number;

    /**
     * 高度，默认 200。
     */
    height?: number;

    padding?: number;

    ref?: { (el: Ref): void; };
}

const presetProps: Readonly<Partial<Props>> = {
    width: 200,
    height: 200,
    type: 'square',
    errorCorrectionLevel: 'M',
};

/**
 * 生成各类编码的图片
 */
export function QRCode(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const [ref, setRef] = createSignal<HTMLSpanElement>();

    let download: Ref['download'];
    const init = () => {
        const opt: Partial<Options> = {
            width: props.width,
            height: props.height,
            data: props.value,
            type: 'svg',
            margin: props.padding ?? 0,
            qrOptions: {
                errorCorrectionLevel: props.errorCorrectionLevel,
            },
            dotsOptions: {
                color: 'var(--fg)',
                type: props.type,
            },
            backgroundOptions: {
                color: 'var(--bg)'
            }
        };

        if (props.cornerDotType) {
            opt.cornersDotOptions = {
                type: props.cornerDotType
            };
        }

        if (props.cornerSquareType) {
            opt.cornersSquareOptions = {
                type: props.cornerSquareType,
            };
        }

        while (ref() && ref()!.firstChild) {
            ref()!.removeChild(ref()!.firstChild!);
        }

        const qr = new QRCodeStyling(opt);
        qr.append(ref());

        download = async (name?: string, ext?: FileExtension): Promise<void> => {
            // 因为用到的颜色是 var(--bg) 的 CSS 变量，下载时，这些引用的外部变量无法自动转换。
            // 所以需要创建一个临时的对象，并将 CSS 变量计算为对应的值。

            const elem = ref() ?? document.documentElement;
            const qr2 = new QRCodeStyling(Object.assign(structuredClone(opt), {
                backgroundOptions: { color: getComputedStyle(elem).getPropertyValue('--bg') },
                dotsOptions: { color: getComputedStyle(elem).getPropertyValue('--fg') },
            }));
            return await qr2.download({ name: name, extension: ext });
        };
    };

    createEffect(init);
    onMount(init);

    if (props.ref) {
        props.ref({
            async download(name, ext): Promise<void> {
                return await download(name, ext);
            }
        });
    }

    return <span ref={setRef}
        class={joinClass(styles.qrcode, props.palette ? `palette--${props.palette}` : '', props.class)}
    />;
}
