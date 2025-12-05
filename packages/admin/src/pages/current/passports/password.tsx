// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, createForm, Dialog, DialogRef, Password, TextField } from '@cmfx/components';
import { useNavigate } from '@solidjs/router';
import { JSX } from 'solid-js';
import IconPasskey from '~icons/material-symbols/passkey';
import IconPassword from '~icons/material-symbols/password-2';
import IconPerson from '~icons/material-symbols/person';
import { z } from 'zod';

import { useAdmin, useLocale } from '@/context';
import { PassportComponents, RefreshFunc } from './passports';
import styles from './style.module.css';

const passwordAccountSchema = z.object({
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
});

const passwordValueSchema = z.object({
    old: z.string().min(1).max(100),
    new: z.string().min(1).max(100),
});

/**
 * 密码登录方式
 */
export class Pwd implements PassportComponents {
    #id: string;

    /**
     * 构造函数
     *
     * @param id - 组件的 ID；
     */
    constructor(id: string) {
        this.#id = id;
    }

    Login(): JSX.Element {
        const l = useLocale();
        const [api, act, opt] = useAdmin();
        const nav = useNavigate();
        const [fapi, Form, actions] = createForm({
            value: passwordAccountSchema.partial().parse({}),
            submit: async obj => {
                const ret = await api.post(`/passports/${this.#id}/login`, obj);
                await act.login(ret);
                return ret;
            },
            onProblem: p => act.outputProblem(p),
            onSuccess: async () => {
                nav(opt.routes.private.home);
            }
        });

        return <Form class={styles.password}>
            <TextField hasHelp prefix={<IconPerson class={styles['text-field']} />} autocomplete='username'
                placeholder={l.t('_p.current.username')} accessor={fapi.accessor<string>('username')} />
            <Password hasHelp prefix={<IconPassword class={styles['text-field']} />} autocomplete='current-password'
                placeholder={l.t('_p.current.password')} accessor={fapi.accessor<string>('password')} />

            <actions.Submit palette='primary' disabled={fapi.accessor<string>('username').getValue() == ''}>{l.t('_c.ok')}</actions.Submit>
            <actions.Reset palette='secondary' disabled={fapi.isPreset()}> {l.t('_c.reset')} </actions.Reset>
        </Form>;
    }

    Actions(_: RefreshFunc): JSX.Element {
        let dialogRef: DialogRef;
        const l = useLocale();
        const [api, act] = useAdmin();
        const [fapi , Form, actions] = createForm({
            value: passwordValueSchema.partial().parse({}),
            submit: async obj => {
                const r = await api.put(`/passports/${this.#id}`, obj);
                await act.refetchUser();
                return r;
            },
            onProblem: p => act.outputProblem(p),
        });

        return <>
            <Button square rounded title={l.t('_p.current.changePassword')} onclick={() => {
                dialogRef.element().showModal();
            }}><IconPasskey /></Button>

            <Dialog ref={(el) => dialogRef = el} header={l.t('_p.current.changePassword')}>
                <Form class={styles['action-form']}>
                    <TextField placeholder={l.t('_p.current.oldPassword')} accessor={fapi.accessor<string>('old')} />
                    <TextField placeholder={l.t('_p.current.newPassword')} accessor={fapi.accessor<string>('new')} />

                    <actions.Submit class="ms-auto">{ l.t('_c.ok') }</actions.Submit>
                </Form>
            </Dialog>
        </>;
    }
}
