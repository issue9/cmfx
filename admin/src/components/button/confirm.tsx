// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX, mergeProps, splitProps } from 'solid-js';

import { useApp } from '@/app/context';
import { Corner, handleEvent } from '@/components/base';
import { Dropdown } from '@/components/dropdown';
import Button, { Props as BaseProps, defaultProps as defaultBaseProps } from './button';
import { ClickFunc } from './types';

export interface Props extends BaseProps {
    /**
     * 确认框的提示内容，如果为空会显示一条默认的提示语句。
     */
    prompt?: JSX.Element;

    /**
     * 弹出框的位置
     */
    pos?: Corner

    /**
     * 自定义确定按钮上的内容
     */
    ok?: JSX.Element;

    /**
     * 自定义取消按钮上的内容
     */
    cancel?: JSX.Element;

    /**
     * 点击事件
     *
     * 这将在用户点击确认按钮之后执行。
     */
    onClick: ClickFunc; // 此处重新声明只是为了将可选字段变为必填字段。
}


const defaultProps: Readonly<Partial<Props>> = {
    ...defaultBaseProps,
    pos: 'bottomleft'
};

/**
 * 带确认功能的按钮
 */
export default function(props: Props) {
    props = mergeProps(defaultProps, props);

    const ctx = useApp();

    const [_, btnProps] = splitProps(props, ['children', 'onClick', 'prompt', 'palette', 'ok', 'cancel', 'pos']);
    const [visible, setVisible] = createSignal(false);

    const confirm: ClickFunc = (e) => {
        handleEvent(props.onClick, e);
        setVisible(false);
    };

    const activator = <Button onClick={() => setVisible(!visible())} {...btnProps}>{props.children}</Button>;

    return <Dropdown class='c--confirm-button-panel'
        pos={props.pos} visible={visible()} setVisible={setVisible}
        palette={props.palette} activator={activator}>
        {props.prompt ?? ctx.t('_i.areYouSure')}
        <div class="actions">
            <Button palette='secondary' onClick={()=>setVisible(false)}>{ props.cancel ?? ctx.t('_i.cancel') }</Button>
            <Button palette='primary' autofocus onClick={confirm}>{ props.ok ?? ctx.t('_i.ok') }</Button>
        </div>
    </Dropdown>;
}
