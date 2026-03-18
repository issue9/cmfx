// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Layout, MountProps } from '@cmfx/components';
import { Button, ButtonGroup, Code, joinClass, ThemeProvider, ToggleButton, useLocale } from '@cmfx/components';
import { type Component, createMemo, createSignal, type JSX, mergeProps, onCleanup, onMount, Show } from 'solid-js';
import IconDark from '~icons/material-symbols/dark-mode';
import IconLTR from '~icons/material-symbols/format-align-left-rounded';
import IconRTL from '~icons/material-symbols/format-align-right-rounded';
import IconLight from '~icons/material-symbols/light-mode';

import styles from './style.module.css';

export interface Props {
	/**
	 * 组件的源代码
	 */
	source: string;

	/**
	 * 源代码对应的组件
	 *
	 * @remarks
	 * 该组件可以接受一个 {@link MountProps} 类型作为组件的属性列表。
	 * 组件内可以通过 {@link MountProps.mount} 将设置项添加到工具栏上。
	 */
	component: Component<MountProps>;

	/**
	 * 标题的翻译 ID
	 */
	title?: string;

	/**
	 * 对当前演示代码描述的翻译 ID
	 */
	desc?: string;

	/**
	 * 组件内的演示内容高度
	 */
	height?: JSX.CSSProperties['height'];

	/**
	 * 整个演示对象的布局
	 */
	layout?: Layout | 'auto';
}

/**
 * 用于展示组件的舞台
 */
export default function Stage(props: Props): JSX.Element {
	const l = useLocale();

	props = mergeProps({ layout: 'auto' as Layout }, props);

	const initDir = window.getComputedStyle(document.body).direction === 'rtl' ? 'rtl' : 'ltr';
	const [dir, setDir] = createSignal<'ltr' | 'rtl'>(initDir);
	const [mode, setMode] = createSignal<'light' | 'dark'>('light');

	const [demoRef, setDemoRef] = createSignal<HTMLDivElement>();
	const [codeHeight, setCodeHeight] = createSignal<string>();

	onMount(() => {
		const ro = new ResizeObserver(entries => {
			setCodeHeight(`${entries[0]!.borderBoxSize[0].blockSize.toString()}px`);
		});
		ro.observe(demoRef()!);

		onCleanup(() => ro.disconnect());
	});

	const stageCls = createMemo(() => {
		return joinClass(
			undefined,
			styles.stage,
			props.layout === 'auto' ? styles.auto : props.layout === 'vertical' ? styles.vertical : '',
		);
	});

	let settingRef: HTMLElement;

	return (
		<>
			<Show when={props.title}>{title => <h4>{l.t(title())}</h4>}</Show>

			<Show when={props.desc}>{desc => <article class={styles.desc}>{l.t(desc())}</article>}</Show>

			<div class={stageCls()}>
				<div class={styles.demo} ref={setDemoRef} style={{ height: props.height }}>
					<div class={styles.toolbar}>
						<div class={styles.left}>
							<ToggleButton.FitScreen square container={demoRef()!} />

							<ButtonGroup.Root>
								<Button.Root
									square
									checked={dir() === 'rtl'}
									onclick={() => {
										setDir('rtl');
									}}
								>
									<IconRTL />
								</Button.Root>
								<Button.Root
									square
									checked={dir() === 'ltr'}
									onclick={() => {
										setDir('ltr');
									}}
								>
									<IconLTR />
								</Button.Root>
							</ButtonGroup.Root>

							<ButtonGroup.Root>
								<Button.Root
									square
									checked={mode() === 'dark'}
									onclick={() => {
										setMode('dark');
									}}
								>
									<IconDark />
								</Button.Root>
								<Button.Root
									square
									checked={mode() === 'light'}
									onclick={() => {
										setMode('light');
									}}
								>
									<IconLight />
								</Button.Root>
							</ButtonGroup.Root>
						</div>

						<div
							class={styles.right}
							ref={el => {
								settingRef = el;
							}}
						/>
					</div>

					<ThemeProvider mode={mode()}>
						<div dir={dir()} class={joinClass(undefined, styles.component)}>
							{props.component({ mount: settingRef! })}
						</div>
					</ThemeProvider>
				</div>

				<Show when={props.source}>
					{s => (
						<Code.Root wrap ln={0} lang="tsx" class={styles.code} style={{ height: codeHeight() }}>
							{s()}
						</Code.Root>
					)}
				</Show>
			</div>
		</>
	);
}
