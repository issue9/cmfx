// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import QRCodeStyling, { CornerDotType, CornerSquareType, DotType, ErrorCorrectionLevel, Options } from 'qr-code-styling';
import { createEffect, JSX, mergeProps } from 'solid-js';

import { BaseProps } from '@/components/base';

export interface Props extends BaseProps {
    /**
     * 需要生成图片的值
     *
     * 根据 {@link Props#type} 的不同，对值的要求也是不同的。
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

    let ref: HTMLSpanElement;

    createEffect(() => {
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

        while(ref.firstChild) {
            ref.removeChild(ref.firstChild);
        }

        const qr = new QRCodeStyling(opt);
        qr.append(ref);
    });

    return <span ref={el => ref = el} classList={{
        [`palette--${props.palette}`]: !!props.palette,
        'c--qrcode': true,
    }} />;
}