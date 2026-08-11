// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, Match, onMount, type ParentProps, Switch, splitProps } from 'solid-js';

import { OptionsProvider, useOptions } from '@components/context/options/context';
import { initEnv, type Options } from '@components/context/options/options';
import { DialogProvider } from '@components/dialog/system';
import { NotifyProvider } from '@components/notify/notify/notify';
import styles from './style.module.css';

export type AppProps = ParentProps<
	Options & {
		/**
		 * 组件挂载的元素
		 *
		 * @remarks
		 * 会在 mountedElement 上添加以下 CSS 属性： `container-name: root`，
		 * 子组件的 css 样式可以使用此作为容器查询，比如 {@link NotifyProvider} 就使用 `@sm/root:` 作为样式变体。
		 */
		readonly mountedElement: HTMLElement;
	}
>;

/**
 * 为所有组件提供一个可运行的环境
 *
 * @remarks
 * 所有组件都必须运行在此组件之内，否则可能出错。
 * 也可以使用 {@link run} 直接运行项目。
 */
export function App(props: AppProps): JSX.Element {
	const [xo, options] = splitProps(props, ['children', 'mountedElement']);
	const [opt, complete] = initEnv(options);

	xo.mountedElement.classList.add(styles.root);

	return (
		<Switch fallback={opt.loading({})}>
			<Match when={complete()}>
				<OptionsProvider {...opt}>
					<DialogProvider mount={xo.mountedElement} palette="primary">
						<NotifyProvider mount={xo.mountedElement}>
							<Initialized>{xo.children}</Initialized>
						</NotifyProvider>
					</DialogProvider>
				</OptionsProvider>
			</Match>
		</Switch>
	);
}

function Initialized(props: ParentProps): JSX.Element {
	const [, opt] = useOptions();
	onMount(() => opt.onInitialized?.());
	return props.children;
}
