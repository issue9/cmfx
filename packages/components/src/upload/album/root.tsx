// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, For, type JSX, mergeProps, onMount, Show } from 'solid-js';
import IconAdd from '~icons/material-symbols/add';
import IconUpload from '~icons/material-symbols/upload';
import IconUploadFile from '~icons/material-symbols/upload-file';

import { type BaseRef, joinClass, type RefProps } from '@components/base';
import { Form } from '@components/form';
import { Upload } from '@components/upload/upload';
import { PreviewFile, PreviewURL } from './preview.tsx';
import styles from './style.module.css';

export interface Ref extends BaseRef<HTMLFieldSetElement> {
	uploader(): Upload.RootRef;
}

export interface Props
	extends Omit<Upload.RootProps, 'dropzone' | 'ref'>,
		Form.ValueProps<Array<string>>,
		RefProps<Ref> {
	/**
	 * 是否接受直接拖入文件
	 */
	droppable?: boolean;

	/**
	 * 是否自动执行上传操作
	 *
	 * @reactive
	 */
	auto?: boolean;

	/**
	 * 逆向显示内容，这将会导致上传按钮显示在最前面。
	 */
	reverse?: boolean;

	/**
	 * 子项的宽度
	 *
	 * @reactive
	 */
	itemSize?: string;

	/**
	 * 圆角
	 *
	 * @reactive
	 */
	rounded?: boolean;
}

const presetProps: Readonly<Partial<Props>> = {
	itemSize: '72px',
	tabindex: 0,
} as const;

export function Root(props: Props): JSX.Element {
	const field = Form.useField(props, true);
	const form = Form.useForm();
	props = mergeProps(presetProps, form, props);

	let dropRef: HTMLFieldSetElement;
	let uploadRef: Upload.RootRef;

	onMount(() => {
		if (!props.droppable) {
			dropRef.addEventListener('dragover', e => {
				e.dataTransfer!.dropEffect = 'none';
				e.preventDefault();
			});
			return;
		}
	});

	const size = createMemo((): JSX.CSSProperties => {
		return { height: props.itemSize, width: props.itemSize };
	});

	return (
		<fieldset ref={el => (dropRef = el)} class={styles['upload-content']} disabled={props.disabled}>
			<Upload.Root
				ref={el => {
					uploadRef = el;
					if (props.ref) {
						props.ref({
							root: () => dropRef,
							uploader: () => uploadRef,
						});
					}
				}}
				upload={props.upload}
				fieldName={props.fieldName}
				multiple={props.multiple}
				accept={props.accept}
				dropzone={dropRef!}
			/>

			<For each={field.getValue()}>
				{item => (
					<PreviewURL
						size={props.itemSize!}
						url={item}
						del={() => {
							const old = field.getValue();
							const n = old ? old.filter(v => v !== item) : [];
							field.setValue(n);
							if (props.onChange) {
								props.onChange(n, old);
							}
						}}
					/>
				)}
			</For>

			<For each={uploadRef!.files()}>
				{(item, index) => {
					return <PreviewFile size={props.itemSize!} file={item} del={() => uploadRef.delete(index())} />;
				}}
			</For>
			<Show when={props.auto && (props.multiple || field.getValue().length + uploadRef!.files().length === 0)}>
				<button
					type="button"
					disabled={props.disabled}
					style={size()}
					class={joinClass(undefined, styles.action, props.reverse ? styles.start : '')}
					onclick={async () => {
						uploadRef.pick();
						await uploadRef.upload();
					}}
				>
					<IconUploadFile />
				</button>
			</Show>
			<Show when={!props.auto}>
				<Show when={props.multiple || field.getValue().length + uploadRef!.files().length === 0}>
					<button
						type="button"
						disabled={props.disabled}
						style={size()}
						class={joinClass(undefined, styles.action, props.reverse ? styles.start : '')}
						onclick={() => uploadRef.pick()}
					>
						<IconAdd />
					</button>
				</Show>
				<Show when={uploadRef!.files().length > 0}>
					<button
						type="button"
						disabled={props.disabled}
						style={size()}
						class={joinClass(undefined, styles.action, props.reverse ? styles.start : '')}
						onclick={() => uploadRef!.upload()}
					>
						<IconUpload />
					</button>
				</Show>
			</Show>
		</fieldset>
	);
}
