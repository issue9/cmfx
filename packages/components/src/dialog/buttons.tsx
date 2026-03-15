// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, splitProps } from 'solid-js';

import { Button } from '@components/button';
import { useLocale } from '@components/context';
import { useDialog } from './context';
import styles from './style.module.css';

export interface ButtonProps extends Omit<Button.ButtonProps, 'onclick' | 'type'> {
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
 * 点击该按钮，会关闭对话框，同时将 {@link ButtonProps.value} 传递给对话框的 returnValue 属性。
 */
export function AcceptButton(props: ButtonProps): JSX.Element {
	const ref = useDialog();
	const [_, p] = splitProps(props, ['children', 'palette', 'onclick']);
	return (
		<Button.Root
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
		</Button.Root>
	);
}

/**
 * 对话框中的取消按钮
 *
 * @remarks
 * 点击该按钮，会关闭对话框，相比于 {@link AcceptButton}，会同时触发 cancel 事件。
 */
export function CancelButton(props: ButtonProps): JSX.Element {
	const ref = useDialog();
	const [_, p] = splitProps(props, ['children', 'palette', 'onclick']);
	return (
		<Button.Root
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
		</Button.Root>
	);
}

export interface ActionsProps {
	rounded?: boolean;
	square?: boolean;
	accept?: ButtonProps['onclick'];
	cancel?: ButtonProps['onclick'];
}

/**
 * 为对话框提供一组默认的按钮组
 */
export function Actions(props: ActionsProps): JSX.Element {
	const l = useLocale();
	return (
		<footer class={styles.footer}>
			<CancelButton rounded={props.rounded} square={props.square} onclick={props.cancel} value="cancel">
				{l.t('_c.cancel')}
			</CancelButton>
			<AcceptButton rounded={props.rounded} square={props.square} onclick={props.accept} value="accept">
				{l.t('_c.ok')}
			</AcceptButton>
		</footer>
	);
}
