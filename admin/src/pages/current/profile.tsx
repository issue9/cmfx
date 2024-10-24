// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, JSX, Show } from 'solid-js';

import { useApp, useOptions, User } from '@/app/context';
import {
    buildEnumsOptions, Button, Choice, Divider, file2Base64, Form,
    FormAccessor, Page, Password, TextField, Upload, UploadRef
} from '@/components';
import { Sex, sexesMap, zeroAdmin } from '@/pages/admins/types';

export default function(): JSX.Element {
    const opt = useOptions();
    const ctx = useApp();
    let uploadRef: UploadRef;

    const infoAccess = new FormAccessor<User>(zeroAdmin(), ctx, (obj)=>{
        return ctx.api.patch(opt.api.info, obj);
    }, async () => {
        await ctx.refetchUser();
    }, (obj) => {
        if (!obj.name) {
            return new Map([['name', ctx.locale().t('_i.error.canNotBeEmpty')]]);
        }
        if (!obj.nickname) {
            return new Map([['nickname', ctx.locale().t('_i.error.canNotBeEmpty')]]);
        }
    });

    const nameA = infoAccess.accessor<string>('name');
    const nicknameA = infoAccess.accessor<string>('nickname');
    const sexA = infoAccess.accessor<Sex>('sex');

    const [avatar, setAvatar] = createSignal('');
    let originAvatar = ''; // 原始的头像内容，在取消上传头像时，可以从此值恢复。

    createEffect(() => {
        const u = ctx.user();
        if (!u) { return; }

        infoAccess.setPreset({ name: u.name, nickname: u.nickname, sex: u.sex });

        nameA.setValue(u.name!);
        nicknameA.setValue(u.nickname!);
        sexA.setValue(u.sex!);

        setAvatar(u.avatar!);
        originAvatar = u.avatar!;
    });

    createEffect(async () => {
        if (uploadRef.files().length > 0) {
            setAvatar(await file2Base64(uploadRef.files()[0]));
        }
    });

    return <Page title='_i.page.current.profile' class="p--profile max-w-md">
        <Upload ref={el => uploadRef = el} fieldName='files' action='/upload' />
        <div class="flex gap-4">
            <img class="rounded-full border border-palette-bg-low w-24 h-24" alt="avatar" src={avatar()} />
            <div class="flex flex-col my-4 items-start justify-center gap-2">
                <p class="text-2xl">{ctx.user()?.name}</p>
                <Show when={uploadRef!.files().length === 0}>
                    <Button palette='tertiary' onClick={async () => {
                        uploadRef.pick();
                    }}>{ctx.locale().t('_i.page.current.pickAvatar')}</Button>
                </Show>
                <Show when={uploadRef!.files().length > 0}>
                    <div class="flex gap-2">
                        <Button palette='primary' onClick={async () => {
                            const ret = await uploadRef.upload();
                            if (!ret) {
                                return;
                            }
                            setAvatar(ret[0]);
                            const r = await ctx.api.patch('/info', { 'avatar': ret[0] });
                            if (!r.ok) {
                                ctx.outputProblem(r.body);
                                return;
                            }
                            await ctx.refetchUser();
                        }}>{ctx.locale().t('_i.page.save')}</Button>

                        <Button palette='error' onClick={()=>{
                            setAvatar(originAvatar);
                            uploadRef.delete(0);
                        }}>{ ctx.locale().t('_i.cancel')}</Button>
                    </div>
                </Show>
            </div>
        </div>

        <Divider padding='4px' />

        <div class="content">
            <Form formAccessor={infoAccess} class="form">
                <TextField class="w-full" label={ctx.locale().t('_i.page.current.name')} accessor={nameA} />
                <TextField class="w-full" label={ctx.locale().t('_i.page.current.nickname')} accessor={nicknameA} />
                <Choice class="w-full" label={ctx.locale().t('_i.page.sex')} accessor={sexA} options={buildEnumsOptions(sexesMap, ctx)} />

                <div class="actions">
                    <Button palette="secondary" type="reset" disabled={infoAccess.isPreset()}>{ctx.locale().t('_i.reset')}</Button>
                    <Button palette="primary" type="submit" disabled={infoAccess.isPreset()}>{ctx.locale().t('_i.page.save')}</Button>
                </div>
            </Form>

            <hr class="w-full border-t border-palette-bg-low sm:hidden" />

            <Pass />
        </div>
    </Page>;
}

interface ProfilePassword {
    old: string;
    new: string;
    confirm: string;
}

function Pass(): JSX.Element {
    const ctx = useApp();

    const passAccess = new FormAccessor<ProfilePassword>({ old: '', new: '', confirm: '' }, ctx, (obj)=>{
        return ctx.api.put('/password', obj);
    }, undefined, (obj)=>{
        if (obj.old === '') {
            return new Map([['old', ctx.locale().t('_i.error.canNotBeEmpty')]]);
        }
        if (obj.new === '') {
            return new Map([['new', ctx.locale().t('_i.error.canNotBeEmpty')]]);
        }

        if (obj.old === obj.new) {
            return new Map([['new', ctx.locale().t('_i.error.oldNewPasswordCanNotBeEqual')]]);
        }
        if (obj.new !== obj.confirm) {
            return new Map([['confirm', ctx.locale().t('_i.error.newConfirmPasswordMustBeEqual')]]);
        }
    });

    return <Form formAccessor={passAccess} class="form">
        <Password class="w-full" autocomplete='current-password' label={ctx.locale().t('_i.page.current.oldPassword')} accessor={passAccess.accessor('old')} />
        <Password class="w-full" autocomplete='new-password' label={ctx.locale().t('_i.page.current.newPassword')} accessor={passAccess.accessor('new')} />
        <Password class="w-full" autocomplete='off' label={ctx.locale().t('_i.page.current.confirmPassword')} accessor={passAccess.accessor('confirm')} />

        <div class="actions">
            <Button disabled={passAccess.isPreset()} palette="primary" type='submit'>{ctx.locale().t('_i.page.update')}</Button>
        </div>
    </Form>;
}
