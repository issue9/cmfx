// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, mergeProps, type ParentProps, splitProps } from 'solid-js';

import type { BaseRef, RefProps } from '@components/base';
import { classList } from '@components/base';
import { useLocale } from '@components/context';
import { Dialog } from '@components/dialog';
import { Form } from '@components/form';
import type { Base } from './panel';
import { Panel } from './panel';
import styles from './style.module.css';

export interface ActivatorRef extends BaseRef<HTMLDivElement> {
	/**
	 * 显示颜色拾取面板
	 */
	showPanel(): void;
}

export interface ActivatorProps extends Base, ParentProps, RefProps<ActivatorRef> {
	/**
	 * 显示激活选择面板的组件
	 */
	activator: true;

	/**
	 * 作用在显示元素上的样式
	 *
	 * @reactive
	 */
	activatorClass?: string;
}

export function Activator(props: ActivatorProps): JSX.Element {
	const l = useLocale();

	const field = Form.useField<string>(props, true);
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);

	const [panelProps, _] = splitProps(props, ['palette', 'wcag', 'spaces']);
	let dlgRef: Dialog.RootRef;

	return (
		<>
			<div
				class={classList(
					undefined,
					{
						[styles.activator]: true,
						[styles.rounded]: props.rounded,
						[styles.readonly]: props.readonly,
						[styles.disabled]: props.disabled,
					},
					props.activatorClass,
				)}
				onclick={() => dlgRef.root().showModal()}
				style={{
					color: field.getValue(),
					background: props.wcag,
				}}
			>
				{props.children ?? field.getValue()}
			</div>

			<Dialog.Root
				ref={el => (dlgRef = el)}
				header={
					<Dialog.Toolbar close movable>
						{l.t('_c.color.pickColor')}
					</Dialog.Toolbar>
				}
			>
				<Panel {...panelProps} onChange={v => field.setValue(v)} value={field.getValue()} />
			</Dialog.Root>
		</>
	);
}
