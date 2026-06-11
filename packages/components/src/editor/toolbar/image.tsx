// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';
import IconClose from '~icons/material-symbols/cancel-rounded';
import IconOK from '~icons/material-symbols/check-circle-unread-outline';
import IconImage from '~icons/material-symbols/image-inset-outline-rounded';

import { Button } from '@components/button';
import { useLocale } from '@components/context';
import { Dialog } from '@components/dialog';
import { Form } from '@components/form';
import { InputText } from '@components/input';
import styles from './style.module.css';
import type { Props } from './types';

type Image = {
	src: string;
	alt?: string;
};

/**
 * https://tiptap.dev/docs/editor/extensions/nodes/image
 */
export function Image(props: Props): JSX.Element {
	const l = useLocale();

	const [F, Field, api] = Form.create<Image>({
		initValue: { src: '', alt: '' },
	});

	let dlg: Dialog.Ref;
	return (
		<>
			<Button
				title={l.t('_c.editor.addImage')}
				kind="flat"
				square
				onclick={() => {
					api.setValue({ src: '', alt: '' });
					dlg.root().showModal();
				}}
			>
				<IconImage />
			</Button>

			<Dialog
				ref={el => (dlg = el)}
				mainClass={styles['image-main']}
				footer={
					<footer>
						<Form.Button
							square
							kind="flat"
							palette="error"
							title={l.t('_c.close')}
							onclick={() => dlg.root().close('close')}
						>
							<IconClose />
						</Form.Button>

						<Form.Button
							square
							kind="flat"
							title={l.t('_c.ok')}
							onclick={() => {
								props.editor.chain().focus().setImage(api.getValue()).run();
								dlg.root().close('ok');
							}}
						>
							<IconOK />
						</Form.Button>
					</footer>
				}
			>
				<F inDialog>
					<Field label="src" name="src">
						<InputText />
					</Field>

					<Field label="alt" name="alt">
						<InputText />
					</Field>
				</F>
			</Dialog>
		</>
	);
}
