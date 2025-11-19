// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import QRCodeStyling, {
    CornerDotType, CornerSquareType, DotType, ErrorCorrectionLevel, FileExtension, Options
} from 'qr-code-styling';
import { createEffect, createSignal, JSX, mergeProps, onMount } from 'solid-js';

import { BaseProps, joinClass, RefProps } from '@/base';
import styles from './style.module.css';

export interface Ref {
    /**
     * 提供下载图片的功能
     */
    download(name?: string, ext?: FileExtension): Promise<void>;

    /**
     * 获取组件的根元素
     */
    element(): HTMLSpanElement;

    /**
     * 提供了 qr-code-styling 的实例
     *
     * @remarks 这是二维码对象的原始操作对象。需要注意的是，
     * 此方法返回的对象提供的下载方法与 {@link download} 在颜色上是不同的。
     */
    qrCodeStyling(): QRCodeStyling;
}

export interface Props extends BaseProps, RefProps<Ref> {
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
    let qr: QRCodeStyling;

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
                color: 'var(--palette-fg)',
                type: props.type,
            },
            backgroundOptions: {
                color: 'var(--palette-bg)'
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

        qr = new QRCodeStyling(opt);
        qr.append(ref());

        download = async (name?: string, ext?: FileExtension): Promise<void> => {
            // 因为用到的颜色是 var(--palette-bg) 的 CSS 变量，下载时，这些引用的外部变量无法自动转换。
            // 所以需要创建一个临时的对象，并将 CSS 变量计算为对应的值。

            const elem = ref() ?? document.documentElement;
            const qr2 = new QRCodeStyling(Object.assign(structuredClone(opt), {
                backgroundOptions: { color: getComputedStyle(elem).getPropertyValue('--palette-bg') },
                dotsOptions: { color: getComputedStyle(elem).getPropertyValue('--palette-fg') },
            }));
            return await qr2.download({ name: name, extension: ext });
        };
    };

    createEffect(init);
    onMount(init);

    return <span class={joinClass(props.palette, styles.qrcode, props.class)} style={props.style} ref={el => {
        setRef(el);

        if (props.ref) {
            props.ref({
                async download(name, ext): Promise<void> { return await download(name, ext); },
                element() { return el; },
                qrCodeStyling() { return qr; }
            });
        }
    }} />;
}
