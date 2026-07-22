// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { calcPopoverPosition, type PopoverPosition } from '@cmfx/core';
import { joinClass, type Palette, type ThemeProps } from '@cmfx/themes';
import { createEffect, createMemo, createSignal, type JSX, onCleanup, onMount } from 'solid-js';

import type { BaseRef } from '@components/base';
import { Button } from '@components/button';
import { useLocale } from '@components/context';
import { Dialog } from '@components/dialog';
import { Label } from '@components/label';
import type { Ref as WizardRef, Step as WizardStep } from '@components/wizard/step';
import styles from './style.module.css';

export interface TourRef extends WizardRef, BaseRef<Dialog.Ref> {
	/**
	 * 显示教程组件，即打开组件对话框。
	 */
	start(): void;

	/**
	 * 完成教程组件，即关闭组件对话框。
	 */
	complete(): void;
}

export interface TourStep extends WizardStep {
	/**
	 * 关联的元素 ID
	 */
	id: string;

	/**
	 * 弹出框相对于关联元素的位置
	 *
	 * @reactive
	 */
	pos: PopoverPosition;

	/**
	 * 图标
	 *
	 * @reactive
	 */
	icon?: JSX.Element;
}

export interface TourProps extends ThemeProps {
	/**
	 * 指定所有教程步骤
	 */
	steps: Array<TourStep>;

	/**
	 * 突出元素的色盘
	 *
	 * @reactive
	 */
	accentPalette?: Palette;

	/**
	 * 第一个页面的开始按钮上的内容
	 *
	 * @reactive
	 */
	start?: JSX.Element;

	/**
	 * 最后一页的结束按钮上的内容
	 *
	 * @reactive
	 */
	complete?: JSX.Element;

	/**
	 * 上一页的按钮上的内容
	 *
	 * @reactive
	 */
	prev?: JSX.Element;

	/**
	 * 下一页的按钮上的内容
	 *
	 * @reactive
	 */
	next?: JSX.Element;

	ref: (el: TourRef) => void;
}

/**
 * 显示教程的组件
 */
export function Tour(props: TourProps): JSX.Element {
	let ref: Dialog.Ref;
	const l = useLocale();
	const [index, setIndex] = createSignal(0);
	const curr = createMemo(() => props.steps[index()]);
	const [open, setOpen] = createSignal(false);

	const header = createMemo(() => {
		const s = `${(index() + 1).toString()}/${props.steps.length.toString()}`;
		if (curr().title) {
			return `${curr().title}(${s})`;
		}
		return s;
	});

	props.ref({
		start: () => {
			setIndex(0);
			ref.root().showModal();
			setOpen(true);
		},

		next: () => setIndex(index() + 1),

		prev: () => setIndex(index() - 1),

		complete: () => {
			setIndex(props.steps.length - 1);
			ref.root().close();
			setOpen(false);
		},

		root: () => ref,
	});

	const removeFocusClass = () => {
		for (let i = 0; i < props.steps.length; i++) {
			const el = document.getElementById(props.steps[i].id);
			if (el) {
				el.classList.remove(styles.focus);
			}
		}
	};

	onMount(() => ref.root().addEventListener('close', removeFocusClass));
	onCleanup(() => ref.root().removeEventListener('close', removeFocusClass));

	createEffect(() => {
		for (let i = 0; i < props.steps.length; i++) {
			const step = props.steps[i];
			const el = document.getElementById(step.id);
			if (!el) {
				continue;
			}

			if (i === index() && open()) {
				el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
				el.classList.add(styles.focus);
				ref.move(calcPopoverPosition(ref.root(), el.getBoundingClientRect(), step.pos, 'start', 8));
			} else {
				el.classList.remove(styles.focus);
			}
		}
	});

	return (
		<Dialog
			palette={props.palette}
			class={joinClass(undefined, styles.tour, props.class)}
			style={props.style}
			ref={el => (ref = el)}
			header={
				<Dialog.Toolbar close>
					<Label icon={curr().icon}>{header()}</Label>
				</Dialog.Toolbar>
			}
			footer={
				<footer class={styles.actions}>
					{index() > 0 && <Button onclick={() => setIndex(index() - 1)}>{props.prev || l.t('_c.tour.prev')}</Button>}
					{index() === 0 && (
						<Button palette={props.accentPalette} onclick={() => setIndex(index() + 1)}>
							{props.next || l.t('_c.tour.start')}
						</Button>
					)}
					{index() < props.steps.length - 1 && index() > 0 && (
						<Button palette={props.accentPalette} onclick={() => setIndex(index() + 1)}>
							{props.next || l.t('_c.tour.next')}
						</Button>
					)}
					{index() === props.steps.length - 1 && (
						<Button palette={props.accentPalette} onclick={() => ref.root().close()}>
							{props.complete || l.t('_c.tour.complete')}
						</Button>
					)}
				</footer>
			}
		>
			{curr()!.content}
		</Dialog>
	);
}
