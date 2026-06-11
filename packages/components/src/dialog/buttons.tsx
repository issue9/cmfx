// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, splitProps } from 'solid-js';

import { Button } from '@components/button';
import { useLocale } from '@components/context';
import { useDialog } from './context';
import styles from './style.module.css';

export interface DialogButtonProps extends Omit<Button.NormalProps, 'onclick' | 'type'> {
	/**
	 * 传递给对话框的值
	 */
	value?: string;

	/**
	 * 按钮上的点击事件类型
	 *
	 * @returns 如果返回 true 表示阻止关闭操作。
	 */
	onclick?: () => Promise<boolean | undefined>;
}

/**
 * 确认对话框的按钮组件
 *
 * @remarks
 * 点击该按钮，会关闭对话框，同时将 {@link DialogButtonProps.value} 传递给对话框的 returnValue 属性。
 */
export function AcceptButton(props: DialogButtonProps): JSX.Element {
	const ref = useDialog();
	const [_, p] = splitProps(props, ['children', 'palette', 'onclick']);
	return (
		<Button
			{...p}
			type="submit"
			palette={props.palette ?? 'primary'}
			onclick={async () => {
				if (props.onclick) {
					const result = await props.onclick();
					if (result) {
						return;
					}
				}

				ref.dialog.root().close(props.value);
			}}
		>
			{props.children}
		</Button>
	);
}

/**
 * 对话框中的取消按钮
 *
 * @remarks
 * 点击该按钮，会关闭对话框，相比于 {@link AcceptButton}，会同时触发 cancel 事件。
 */
export function CancelButton(props: DialogButtonProps): JSX.Element {
	const ref = useDialog();
	const [_, p] = splitProps(props, ['children', 'palette', 'onclick']);

	// 注册 cancel 事件的返回值
	ref.dialog.root().addEventListener('cancel', () => (ref.dialog.root().returnValue = props.value ?? ''));

	return (
		<Button
			{...p}
			type="button"
			palette={props.palette ?? 'secondary'}
			onclick={async () => {
				if (props.onclick) {
					const result = await props.onclick();
					if (result) {
						return;
					}
				}

				ref.dialog.root().dispatchEvent(new Event('cancel'));
				ref.dialog.root().close(props.value);
			}}
		>
			{props.children}
		</Button>
	);
}

export interface DialogActionsProps {
	/**
	 * 所有按钮是否都圆角
	 */
	rounded?: boolean;

	/**
	 * 所有的按钮是否都是方形
	 */
	square?: boolean;

	/**
	 * OK 按钮上的点击事件
	 */
	accept?: DialogButtonProps['onclick'];

	/**
	 * cancel 按钮上的占击事件
	 */
	cancel?: DialogButtonProps['onclick'];

	/**
	 * OK 按钮上的值
	 *
	 * @defaultValue 'accept'
	 */
	acceptValue?: string;

	/**
	 * cancel 按钮上的值
	 *
	 * @defaultValue 'cancel'
	 */
	cancelValue?: string;
}

/**
 * 为对话框提供一组默认的按钮组
 */
export function Actions(props: DialogActionsProps): JSX.Element {
	const l = useLocale();
	return (
		<footer class={styles.footer}>
			<CancelButton
				rounded={props.rounded}
				square={props.square}
				onclick={props.cancel}
				value={props.cancelValue ?? 'cancel'}
			>
				{l.t('_c.cancel')}
			</CancelButton>
			<AcceptButton
				rounded={props.rounded}
				square={props.square}
				onclick={props.accept}
				value={props.acceptValue ?? 'accept'}
			>
				{l.t('_c.ok')}
			</AcceptButton>
		</footer>
	);
}
