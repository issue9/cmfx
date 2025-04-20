// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

const messages = {
    _i: {
        app: {
            keyDesc: '\'<kbd>\'&#8593;\'</kbd>\' \'<kbd>\'&#8595;\'</kbd>\' select item; \'<kbd>\'enter\'</kbd>\' confirm; \'<kbd>\'ESC\'</kbd>\' cancel.',
            searchAtSidebar: 'search at sidebar',
        },
        page: { // 页面的翻译内容
            save: 'save',
            nickname: 'nickname',
            update: 'update',
            editItem: 'edit item',
            deleteItem: 'delete item',
            newItem: 'new item',
            created: 'create time',
            back: 'back',
            id: 'ID',
            no: 'NO',
            state: 'state',
            states: {
                normal: 'normal',
                locked: 'locked',
                deleted: 'deleted'
            },
            actions: 'actions',
            sex: 'sex',
            sexes: {
                male: 'male',
                female: 'female',
                unknown: 'unknown'
            },
            current: {
                dashboard: 'Dashboard',
                logout: 'logout',
                settings: 'Settings',
                allMembers: 'All',
                monthMembers: 'Month',
                weekMembers: 'Week',
                dayMembers: 'Day',
                onlineMembers: 'online',
                activeMembers: 'active',

                login: 'login',
                username: 'username',
                password: 'password',
                loggingOut: 'logging out ...',
                invalidAccount: 'invalid account',

                securitylog: 'security logs',
                content: 'content',
                ip: 'IP',
                ua: 'user agent',
                uaInfo: 'browser: {browser}({browserVersion}) os: {os}({osVersion}) kernel: {kernel}({kernelVersion})',

                profile: 'profile',
                name: 'name',
                nickname: 'nickname',
                pickAvatar: 'pick avatar',
                delete: 'delete',
                changePassword: 'change password',
                oldPassword: 'old password',
                newPassword: 'new password',
                bindTOTP: 'bind totp',
                unbindTOTP: 'unbind totp',
                verifyCode: 'verify code',
                bindWebauthn: 'bind webauthn',
                unbindWebauthn: 'unbind webauthn',
                unbindAllWebauthn: 'unbind all webauthn',
                invalidCode: 'invalid code',
                webauthnCredentials: 'webauthn credentials',
                lastUsed: 'last used',
            },
            system: {
                apis: 'API',
                apiViewer: 'API Viewer',
                router: 'router',
                method: 'method',
                pattern: 'pattern',
                count: 'count',
                last: 'last',
                userErrors: '4XX',
                serverErrors: '5XX',
                max: 'max',
                min: 'min',
                spend: 'spend',

                services: 'services',
                jobs: 'jobs',
                serviceViewer: 'service viewer',
                serviceState: 'state',
                serviceStates: {
                    running: 'running',
                    stopped: 'stopped',
                    failed: 'failed'
                },
                title: 'title',
                error: 'error message',
                next: 'next',
                prev: 'prev',

                info: 'info',
                states: 'states',
                system: 'system',
                backupDB: 'backup database',
                backupDBHelp: 'Manually a backup operation. The scheduled tasks will also perform backup operations with {cron}.',
                clearCache: 'clear cache',
                clearCacheHelp: 'Clear all cache of browser and logout current login user',
                name: 'name',
                arch: 'arch',
                cpus: 'cups',
                go: 'Go',
                goroutines: 'Goroutines',
                uptime: 'uptime',
                platform: 'platform',
                family: 'family',
                version: 'version',
                connections: 'connections',
                unlimited: 'unlimited',
                connectionsHelp: 'allow max open connections: {maxOpenConnections}\nopen connections: {openConnections}\nin use: {inUse}\nidle: {idle}',
                waitCount: 'wait count',
                waitDuration: 'wait duration',
            },
            admin: {
                admin: 'administrator',
                adminsManager: 'admin manager',
                name: 'name',
                addSuccessful: 'Add user successful',
                lockUser: 'Lock user',
                unlockUser: 'unlock user',

                passport: 'passport',
                passportType: 'type',
            },
            member: {
                member: 'member',
                membersManager: 'Members',
                view: 'member info',
                birthday: 'birthday',
                passports: 'passports'
            },
            roles: {
                roles: 'roles',
                rolesManager: 'roles manager',
                permission: 'permission',
                name: 'name',
                editPermission: 'edit permission',
                description: 'description'
            }
        },
    }
};

export default messages;
