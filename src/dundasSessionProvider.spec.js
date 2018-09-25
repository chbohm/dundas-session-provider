"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const dundasSessionProvider_1 = require("./dundasSessionProvider");
describe('api', () => {
    let request;
    let logger = {
        info: (message, metadata) => {
            console.log(message, JSON.stringify(metadata));
        },
        debug: (message, metadata) => {
            console.log(message, JSON.stringify(metadata));
        },
        error: (message, metadata) => {
            console.log(message, JSON.stringify(metadata));
        },
        warn: (message, metadata) => {
            console.log(message, JSON.stringify(metadata));
        }
    };
    beforeEach(() => {
        request = sinon.stub();
    });
    it('should create a new dundas session', () => {
        let accounts = [
            {
                accountName: 'user1',
                password: 'pass1',
                isWindowsLogOn: false,
                deleteOtherSessions: false
            },
            {
                accountName: 'user2',
                password: 'pass2',
                isWindowsLogOn: false,
                deleteOtherSessions: false
            }
        ];
        // first it creates an admin session id in order to look up for sessions in dundas
        request.onCall(0).returns(Promise.resolve({ SessionId: "adminAccount-SessionId1" }));
        //The look up result is returned
        request.onCall(1).returns(Promise.resolve([{ accountName: "user1", id: 'user1_session1' }]));
        //It is being returned the result of deleting the admin session
        request.onCall(2).returns(Promise.resolve([{ accountName: "user1", id: 'user1_session1' }]));
        let provider = new dundasSessionProvider_1.DundasSessionProvider('http://dundasUrl:456/AppPath', 'adminAccount', 'adminPass', accounts, request);
        provider.getSessionId('user1', logger);
    });
});
// [
//   {
//     "accountId": "a255e772-32fe-48f1-8a8c-d273f9418280",
//     "accountName": "I2",
//     "accountDisplayName": "I2 Client Group User",
//     "seatKind": "StandardUser",
//     "createdTime": "2018-09-13T14:27:53.617Z",
//     "id": "e763656b-3175-4945-b4e1-15c1b5ad418f",
//     "cultureName": "en-US",
//     "timeZoneId": "UTC",
//     "timeZoneDisplayName": "(UTC) Coordinated Universal Time",
//     "ipAddress": "190.221.60.234",
//     "customAttributes": [],
//     "userData": [
//       {
//         "key": "dundas_webapp_projectid",
//         "value": "f77874d7-015f-46d7-819b-4b09a77ed8a6",
//         "__classType": "dundas.KeyValuePair"
//       }
//     ],
//     "applicationPrivilegeIds": [
//       "dd085006-9606-4917-9481-00fa24e0bc62",
//       "224516ab-3aab-4b5f-a856-b6f9efd8ae1e",
//       "1190afc8-c412-4a1e-b108-91a5d355a497"
//     ],
//     "groupMembershipIds": [
//       "5a05cd1a-dedf-436e-a767-75d93608bd9f",
//       "eeeb023d-18f4-423e-99b9-8d25667671e2",
//       "00d544b9-bfad-434a-acd9-f2bd7a93f6f8"
//     ],
//     "windowsGroupAccountMembershipIds": [],
//     "lastActivityTime": "2018-09-13T17:26:26.807Z",
//     "validUntil": "2018-09-15T17:26:46.807Z",
//     "__classType": "dundas.session.Session"
//   },
//   {
//     "accountId": "a255e772-32fe-48f1-8a8c-d273f9418280",
//     "accountName": "I2",
//     "accountDisplayName": "I2 Client Group User",
//     "seatKind": "StandardUser",
//     "createdTime": "2018-09-13T13:46:56.297Z",
//     "id": "17235547-635f-4e84-af52-2395d78b2663",
//     "cultureName": "en-US",
//     "timeZoneId": "UTC",
//     "timeZoneDisplayName": "(UTC) Coordinated Universal Time",
//     "ipAddress": "4.14.31.130",
//     "customAttributes": [],
//     "userData": [
//       {
//         "key": "dundas_webapp_projectid",
//         "value": "f77874d7-015f-46d7-819b-4b09a77ed8a6",
//         "__classType": "dundas.KeyValuePair"
//       }
//     ],
//     "applicationPrivilegeIds": [
//       "dd085006-9606-4917-9481-00fa24e0bc62",
//       "224516ab-3aab-4b5f-a856-b6f9efd8ae1e",
//       "1190afc8-c412-4a1e-b108-91a5d355a497"
//     ],
//     "groupMembershipIds": [
//       "5a05cd1a-dedf-436e-a767-75d93608bd9f",
//       "eeeb023d-18f4-423e-99b9-8d25667671e2",
//       "00d544b9-bfad-434a-acd9-f2bd7a93f6f8"
//     ],
//     "windowsGroupAccountMembershipIds": [],
//     "lastActivityTime": "2018-09-13T16:26:16.397Z",
//     "validUntil": "2018-09-15T16:26:36.397Z",
//     "__classType": "dundas.session.Session"
//   },
//   {
//     "accountId": "a255e772-32fe-48f1-8a8c-d273f9418280",
//     "accountName": "I2",
//     "accountDisplayName": "I2 Client Group User",
//     "seatKind": "StandardUser",
//     "createdTime": "2018-09-13T10:09:51.263Z",
//     "id": "4b7ffe58-57b7-4301-8349-26fca05dae73",
//     "cultureName": "en-US",
//     "timeZoneId": "UTC",
//     "timeZoneDisplayName": "(UTC) Coordinated Universal Time",
//     "ipAddress": "4.14.31.130",
//     "customAttributes": [],
//     "userData": [
//       {
//         "key": "dundas_webapp_projectid",
//         "value": "f77874d7-015f-46d7-819b-4b09a77ed8a6",
//         "__classType": "dundas.KeyValuePair"
//       }
//     ],
//     "applicationPrivilegeIds": [
//       "dd085006-9606-4917-9481-00fa24e0bc62",
//       "224516ab-3aab-4b5f-a856-b6f9efd8ae1e",
//       "1190afc8-c412-4a1e-b108-91a5d355a497"
//     ],
//     "groupMembershipIds": [
//       "5a05cd1a-dedf-436e-a767-75d93608bd9f",
//       "eeeb023d-18f4-423e-99b9-8d25667671e2",
//       "00d544b9-bfad-434a-acd9-f2bd7a93f6f8"
//     ],
//     "windowsGroupAccountMembershipIds": [],
//     "lastActivityTime": "2018-09-13T10:09:51.353Z",
//     "validUntil": "2018-09-15T10:10:11.353Z",
//     "__classType": "dundas.session.Session"
//   },
//   {
//     "accountId": "a255e772-32fe-48f1-8a8c-d273f9418280",
//     "accountName": "I2",
//     "accountDisplayName": "I2 Client Group User",
//     "seatKind": "StandardUser",
//     "createdTime": "2018-09-12T17:15:17.223Z",
//     "id": "8916a0e0-fe4e-45dd-a93e-3042e64bfea7",
//     "cultureName": "en-US",
//     "timeZoneId": "UTC",
//     "timeZoneDisplayName": "(UTC) Coordinated Universal Time",
//     "ipAddress": "67.191.220.223",
//     "customAttributes": [],
//     "userData": [
//       {
//         "key": "dundas_webapp_projectid",
//         "value": "f77874d7-015f-46d7-819b-4b09a77ed8a6",
//         "__classType": "dundas.KeyValuePair"
//       }
//     ],
//     "applicationPrivilegeIds": [
//       "dd085006-9606-4917-9481-00fa24e0bc62",
//       "224516ab-3aab-4b5f-a856-b6f9efd8ae1e",
//       "1190afc8-c412-4a1e-b108-91a5d355a497"
//     ],
//     "groupMembershipIds": [
//       "5a05cd1a-dedf-436e-a767-75d93608bd9f",
//       "eeeb023d-18f4-423e-99b9-8d25667671e2",
//       "00d544b9-bfad-434a-acd9-f2bd7a93f6f8"
//     ],
//     "windowsGroupAccountMembershipIds": [],
//     "lastActivityTime": "2018-09-12T17:15:18.45Z",
//     "validUntil": "2018-09-14T17:15:38.45Z",
//     "__classType": "dundas.session.Session"
//   },
//   {
//     "accountId": "a255e772-32fe-48f1-8a8c-d273f9418280",
//     "accountName": "I2",
//     "accountDisplayName": "I2 Client Group User",
//     "seatKind": "StandardUser",
//     "createdTime": "2018-09-11T19:38:22.847Z",
//     "id": "c81287f5-0a6e-41d2-9b4b-3fe624afc6b1",
//     "cultureName": "en-US",
//     "timeZoneId": "UTC",
//     "timeZoneDisplayName": "(UTC) Coordinated Universal Time",
//     "ipAddress": "23.96.209.159",
//     "customAttributes": [],
//     "userData": [
//       {
//         "key": "dundas_webapp_projectid",
//         "value": "f77874d7-015f-46d7-819b-4b09a77ed8a6",
//         "__classType": "dundas.KeyValuePair"
//       }
//     ],
//     "applicationPrivilegeIds": [
//       "dd085006-9606-4917-9481-00fa24e0bc62",
//       "224516ab-3aab-4b5f-a856-b6f9efd8ae1e",
//       "1190afc8-c412-4a1e-b108-91a5d355a497"
//     ],
//     "groupMembershipIds": [
//       "5a05cd1a-dedf-436e-a767-75d93608bd9f",
//       "eeeb023d-18f4-423e-99b9-8d25667671e2",
//       "00d544b9-bfad-434a-acd9-f2bd7a93f6f8"
//     ],
//     "windowsGroupAccountMembershipIds": [],
//     "lastActivityTime": "2018-09-11T19:42:46.07Z",
//     "validUntil": "2018-09-13T19:43:06.07Z",
//     "__classType": "dundas.session.Session"
//   },
//   {
//     "accountId": "a255e772-32fe-48f1-8a8c-d273f9418280",
//     "accountName": "I2",
//     "accountDisplayName": "I2 Client Group User",
//     "seatKind": "StandardUser",
//     "createdTime": "2018-09-12T17:15:17.197Z",
//     "id": "8bc9f3cd-11aa-43a3-970f-666d6726b2c0",
//     "cultureName": "en-US",
//     "timeZoneId": "UTC",
//     "timeZoneDisplayName": "(UTC) Coordinated Universal Time",
//     "ipAddress": "67.191.220.223",
//     "customAttributes": [],
//     "userData": [
//       {
//         "key": "dundas_webapp_projectid",
//         "value": "f77874d7-015f-46d7-819b-4b09a77ed8a6",
//         "__classType": "dundas.KeyValuePair"
//       }
//     ],
//     "applicationPrivilegeIds": [
//       "dd085006-9606-4917-9481-00fa24e0bc62",
//       "224516ab-3aab-4b5f-a856-b6f9efd8ae1e",
//       "1190afc8-c412-4a1e-b108-91a5d355a497"
//     ],
//     "groupMembershipIds": [
//       "5a05cd1a-dedf-436e-a767-75d93608bd9f",
//       "eeeb023d-18f4-423e-99b9-8d25667671e2",
//       "00d544b9-bfad-434a-acd9-f2bd7a93f6f8"
//     ],
//     "windowsGroupAccountMembershipIds": [],
//     "lastActivityTime": "2018-09-12T17:15:17.373Z",
//     "validUntil": "2018-09-14T17:15:37.373Z",
//     "__classType": "dundas.session.Session"
//   },
//   {
//     "accountId": "a255e772-32fe-48f1-8a8c-d273f9418280",
//     "accountName": "I2",
//     "accountDisplayName": "I2 Client Group User",
//     "seatKind": "StandardUser",
//     "createdTime": "2018-09-13T10:09:51.287Z",
//     "id": "f50cb4f1-039d-4952-b478-700058869560",
//     "cultureName": "en-US",
//     "timeZoneId": "UTC",
//     "timeZoneDisplayName": "(UTC) Coordinated Universal Time",
//     "ipAddress": "4.14.31.130",
//     "customAttributes": [],
//     "userData": [
//       {
//         "key": "dundas_webapp_projectid",
//         "value": "f77874d7-015f-46d7-819b-4b09a77ed8a6",
//         "__classType": "dundas.KeyValuePair"
//       }
//     ],
//     "applicationPrivilegeIds": [
//       "dd085006-9606-4917-9481-00fa24e0bc62",
//       "224516ab-3aab-4b5f-a856-b6f9efd8ae1e",
//       "1190afc8-c412-4a1e-b108-91a5d355a497"
//     ],
//     "groupMembershipIds": [
//       "5a05cd1a-dedf-436e-a767-75d93608bd9f",
//       "eeeb023d-18f4-423e-99b9-8d25667671e2",
//       "00d544b9-bfad-434a-acd9-f2bd7a93f6f8"
//     ],
//     "windowsGroupAccountMembershipIds": [],
//     "lastActivityTime": "2018-09-13T13:33:05.223Z",
//     "validUntil": "2018-09-15T13:33:25.223Z",
//     "__classType": "dundas.session.Session"
//   },
//   {
//     "accountId": "a255e772-32fe-48f1-8a8c-d273f9418280",
//     "accountName": "I2",
//     "accountDisplayName": "I2 Client Group User",
//     "seatKind": "StandardUser",
//     "createdTime": "2018-09-13T16:42:12.507Z",
//     "id": "c384d9c4-844b-4edd-b824-87d1d8c14f7c",
//     "cultureName": "en-US",
//     "timeZoneId": "UTC",
//     "timeZoneDisplayName": "(UTC) Coordinated Universal Time",
//     "ipAddress": "4.14.31.130",
//     "customAttributes": [],
//     "userData": [
//       {
//         "key": "dundas_webapp_projectid",
//         "value": "f77874d7-015f-46d7-819b-4b09a77ed8a6",
//         "__classType": "dundas.KeyValuePair"
//       }
//     ],
//     "applicationPrivilegeIds": [
//       "dd085006-9606-4917-9481-00fa24e0bc62",
//       "224516ab-3aab-4b5f-a856-b6f9efd8ae1e",
//       "1190afc8-c412-4a1e-b108-91a5d355a497"
//     ],
//     "groupMembershipIds": [
//       "5a05cd1a-dedf-436e-a767-75d93608bd9f",
//       "eeeb023d-18f4-423e-99b9-8d25667671e2",
//       "00d544b9-bfad-434a-acd9-f2bd7a93f6f8"
//     ],
//     "windowsGroupAccountMembershipIds": [],
//     "lastActivityTime": "2018-09-13T16:42:33.927Z",
//     "validUntil": "2018-09-15T16:42:53.927Z",
//     "__classType": "dundas.session.Session"
//   },
//   {
//     "accountId": "a255e772-32fe-48f1-8a8c-d273f9418280",
//     "accountName": "I2",
//     "accountDisplayName": "I2 Client Group User",
//     "seatKind": "StandardUser",
//     "createdTime": "2018-09-12T18:29:50.65Z",
//     "id": "66fd3d96-7a38-40b0-a64b-931795fad199",
//     "cultureName": "en-US",
//     "timeZoneId": "UTC",
//     "timeZoneDisplayName": "(UTC) Coordinated Universal Time",
//     "ipAddress": "4.14.31.130",
//     "customAttributes": [],
//     "userData": [
//       {
//         "key": "dundas_webapp_projectid",
//         "value": "f77874d7-015f-46d7-819b-4b09a77ed8a6",
//         "__classType": "dundas.KeyValuePair"
//       }
//     ],
//     "applicationPrivilegeIds": [
//       "dd085006-9606-4917-9481-00fa24e0bc62",
//       "224516ab-3aab-4b5f-a856-b6f9efd8ae1e",
//       "1190afc8-c412-4a1e-b108-91a5d355a497"
//     ],
//     "groupMembershipIds": [
//       "5a05cd1a-dedf-436e-a767-75d93608bd9f",
//       "eeeb023d-18f4-423e-99b9-8d25667671e2",
//       "00d544b9-bfad-434a-acd9-f2bd7a93f6f8"
//     ],
//     "windowsGroupAccountMembershipIds": [],
//     "lastActivityTime": "2018-09-12T18:29:52.577Z",
//     "validUntil": "2018-09-14T18:30:12.577Z",
//     "__classType": "dundas.session.Session"
//   },
//   {
//     "accountId": "a255e772-32fe-48f1-8a8c-d273f9418280",
//     "accountName": "I2",
//     "accountDisplayName": "I2 Client Group User",
//     "seatKind": "StandardUser",
//     "createdTime": "2018-09-13T12:39:49.433Z",
//     "id": "00dfc219-ad31-431e-a253-93b7bb4780f0",
//     "cultureName": "en-US",
//     "timeZoneId": "UTC",
//     "timeZoneDisplayName": "(UTC) Coordinated Universal Time",
//     "ipAddress": "23.96.209.159",
//     "customAttributes": [],
//     "userData": [
//       {
//         "key": "dundas_webapp_projectid",
//         "value": "f77874d7-015f-46d7-819b-4b09a77ed8a6",
//         "__classType": "dundas.KeyValuePair"
//       }
//     ],
//     "applicationPrivilegeIds": [
//       "dd085006-9606-4917-9481-00fa24e0bc62",
//       "224516ab-3aab-4b5f-a856-b6f9efd8ae1e",
//       "1190afc8-c412-4a1e-b108-91a5d355a497"
//     ],
//     "groupMembershipIds": [
//       "5a05cd1a-dedf-436e-a767-75d93608bd9f",
//       "eeeb023d-18f4-423e-99b9-8d25667671e2",
//       "00d544b9-bfad-434a-acd9-f2bd7a93f6f8"
//     ],
//     "windowsGroupAccountMembershipIds": [],
//     "lastActivityTime": "2018-09-13T12:52:48.167Z",
//     "validUntil": "2018-09-15T12:53:08.167Z",
//     "__classType": "dundas.session.Session"
//   },
//   {
//     "accountId": "a255e772-32fe-48f1-8a8c-d273f9418280",
//     "accountName": "I2",
//     "accountDisplayName": "I2 Client Group User",
//     "seatKind": "StandardUser",
//     "createdTime": "2018-09-13T13:41:21.023Z",
//     "id": "51bc7f02-2e0d-4519-abc3-96a254d8dde6",
//     "cultureName": "en-US",
//     "timeZoneId": "UTC",
//     "timeZoneDisplayName": "(UTC) Coordinated Universal Time",
//     "ipAddress": "4.14.31.130",
//     "customAttributes": [],
//     "userData": [
//       {
//         "key": "dundas_webapp_projectid",
//         "value": "f77874d7-015f-46d7-819b-4b09a77ed8a6",
//         "__classType": "dundas.KeyValuePair"
//       }
//     ],
//     "applicationPrivilegeIds": [
//       "dd085006-9606-4917-9481-00fa24e0bc62",
//       "224516ab-3aab-4b5f-a856-b6f9efd8ae1e",
//       "1190afc8-c412-4a1e-b108-91a5d355a497"
//     ],
//     "groupMembershipIds": [
//       "5a05cd1a-dedf-436e-a767-75d93608bd9f",
//       "eeeb023d-18f4-423e-99b9-8d25667671e2",
//       "00d544b9-bfad-434a-acd9-f2bd7a93f6f8"
//     ],
//     "windowsGroupAccountMembershipIds": [],
//     "lastActivityTime": "2018-09-13T13:42:26.02Z",
//     "validUntil": "2018-09-15T13:42:46.02Z",
//     "__classType": "dundas.session.Session"
//   },
//   {
//     "accountId": "a255e772-32fe-48f1-8a8c-d273f9418280",
//     "accountName": "I2",
//     "accountDisplayName": "I2 Client Group User",
//     "seatKind": "StandardUser",
//     "createdTime": "2018-09-13T12:12:08.907Z",
//     "id": "78b68ec2-5c9c-413a-971c-afc7db3c2407",
//     "cultureName": "en-US",
//     "timeZoneId": "UTC",
//     "timeZoneDisplayName": "(UTC) Coordinated Universal Time",
//     "ipAddress": "190.221.160.130",
//     "customAttributes": [],
//     "userData": [
//       {
//         "key": "dundas_webapp_projectid",
//         "value": "f77874d7-015f-46d7-819b-4b09a77ed8a6",
//         "__classType": "dundas.KeyValuePair"
//       }
//     ],
//     "applicationPrivilegeIds": [
//       "dd085006-9606-4917-9481-00fa24e0bc62",
//       "224516ab-3aab-4b5f-a856-b6f9efd8ae1e",
//       "1190afc8-c412-4a1e-b108-91a5d355a497"
//     ],
//     "groupMembershipIds": [
//       "5a05cd1a-dedf-436e-a767-75d93608bd9f",
//       "eeeb023d-18f4-423e-99b9-8d25667671e2",
//       "00d544b9-bfad-434a-acd9-f2bd7a93f6f8"
//     ],
//     "windowsGroupAccountMembershipIds": [],
//     "lastActivityTime": "2018-09-13T17:30:29.563Z",
//     "validUntil": "2018-09-15T17:30:49.563Z",
//     "__classType": "dundas.session.Session"
//   },
//   {
//     "accountId": "a255e772-32fe-48f1-8a8c-d273f9418280",
//     "accountName": "I2",
//     "accountDisplayName": "I2 Client Group User",
//     "seatKind": "StandardUser",
//     "createdTime": "2018-09-11T18:12:02.74Z",
//     "id": "b5b79202-1c86-4107-9d91-bbefb5bb25d6",
//     "cultureName": "en-US",
//     "timeZoneId": "UTC",
//     "timeZoneDisplayName": "(UTC) Coordinated Universal Time",
//     "ipAddress": "4.14.31.130",
//     "customAttributes": [],
//     "userData": [
//       {
//         "key": "dundas_webapp_projectid",
//         "value": "f77874d7-015f-46d7-819b-4b09a77ed8a6",
//         "__classType": "dundas.KeyValuePair"
//       }
//     ],
//     "applicationPrivilegeIds": [
//       "dd085006-9606-4917-9481-00fa24e0bc62",
//       "224516ab-3aab-4b5f-a856-b6f9efd8ae1e",
//       "1190afc8-c412-4a1e-b108-91a5d355a497"
//     ],
//     "groupMembershipIds": [
//       "5a05cd1a-dedf-436e-a767-75d93608bd9f",
//       "eeeb023d-18f4-423e-99b9-8d25667671e2",
//       "00d544b9-bfad-434a-acd9-f2bd7a93f6f8"
//     ],
//     "windowsGroupAccountMembershipIds": [],
//     "lastActivityTime": "2018-09-11T18:12:14.087Z",
//     "validUntil": "2018-09-13T18:12:34.087Z",
//     "__classType": "dundas.session.Session"
//   },
//   {
//     "accountId": "a255e772-32fe-48f1-8a8c-d273f9418280",
//     "accountName": "I2",
//     "accountDisplayName": "I2 Client Group User",
//     "seatKind": "StandardUser",
//     "createdTime": "2018-09-13T12:49:29.16Z",
//     "id": "8be94edd-d723-4b02-9fce-bc16ab1d458f",
//     "cultureName": "en-US",
//     "timeZoneId": "UTC",
//     "timeZoneDisplayName": "(UTC) Coordinated Universal Time",
//     "ipAddress": "23.96.209.159",
//     "customAttributes": [],
//     "userData": [
//       {
//         "key": "dundas_webapp_projectid",
//         "value": "f77874d7-015f-46d7-819b-4b09a77ed8a6",
//         "__classType": "dundas.KeyValuePair"
//       }
//     ],
//     "applicationPrivilegeIds": [
//       "dd085006-9606-4917-9481-00fa24e0bc62",
//       "224516ab-3aab-4b5f-a856-b6f9efd8ae1e",
//       "1190afc8-c412-4a1e-b108-91a5d355a497"
//     ],
//     "groupMembershipIds": [
//       "5a05cd1a-dedf-436e-a767-75d93608bd9f",
//       "eeeb023d-18f4-423e-99b9-8d25667671e2",
//       "00d544b9-bfad-434a-acd9-f2bd7a93f6f8"
//     ],
//     "windowsGroupAccountMembershipIds": [],
//     "lastActivityTime": "2018-09-13T12:52:48.487Z",
//     "validUntil": "2018-09-15T12:53:08.487Z",
//     "__classType": "dundas.session.Session"
//   },
//   {
//     "accountId": "a255e772-32fe-48f1-8a8c-d273f9418280",
//     "accountName": "I2",
//     "accountDisplayName": "I2 Client Group User",
//     "seatKind": "StandardUser",
//     "createdTime": "2018-09-13T10:09:51.213Z",
//     "id": "8c1f9e51-dd3f-4f86-b559-cb697f2df03f",
//     "cultureName": "en-US",
//     "timeZoneId": "UTC",
//     "timeZoneDisplayName": "(UTC) Coordinated Universal Time",
//     "ipAddress": "4.14.31.130",
//     "customAttributes": [],
//     "userData": [
//       {
//         "key": "dundas_webapp_projectid",
//         "value": "f77874d7-015f-46d7-819b-4b09a77ed8a6",
//         "__classType": "dundas.KeyValuePair"
//       }
//     ],
//     "applicationPrivilegeIds": [
//       "dd085006-9606-4917-9481-00fa24e0bc62",
//       "224516ab-3aab-4b5f-a856-b6f9efd8ae1e",
//       "1190afc8-c412-4a1e-b108-91a5d355a497"
//     ],
//     "groupMembershipIds": [
//       "5a05cd1a-dedf-436e-a767-75d93608bd9f",
//       "eeeb023d-18f4-423e-99b9-8d25667671e2",
//       "00d544b9-bfad-434a-acd9-f2bd7a93f6f8"
//     ],
//     "windowsGroupAccountMembershipIds": [],
//     "lastActivityTime": "2018-09-13T10:09:51.353Z",
//     "validUntil": "2018-09-15T10:10:11.353Z",
//     "__classType": "dundas.session.Session"
//   },
//   {
//     "accountId": "a255e772-32fe-48f1-8a8c-d273f9418280",
//     "accountName": "I2",
//     "accountDisplayName": "I2 Client Group User",
//     "seatKind": "StandardUser",
//     "createdTime": "2018-09-12T17:15:17.247Z",
//     "id": "8e00f76f-c6b8-45fe-8c8a-db7e2f3696d1",
//     "cultureName": "en-US",
//     "timeZoneId": "UTC",
//     "timeZoneDisplayName": "(UTC) Coordinated Universal Time",
//     "ipAddress": "67.191.220.223",
//     "customAttributes": [],
//     "userData": [
//       {
//         "key": "dundas_webapp_projectid",
//         "value": "f77874d7-015f-46d7-819b-4b09a77ed8a6",
//         "__classType": "dundas.KeyValuePair"
//       }
//     ],
//     "applicationPrivilegeIds": [
//       "dd085006-9606-4917-9481-00fa24e0bc62",
//       "224516ab-3aab-4b5f-a856-b6f9efd8ae1e",
//       "1190afc8-c412-4a1e-b108-91a5d355a497"
//     ],
//     "groupMembershipIds": [
//       "5a05cd1a-dedf-436e-a767-75d93608bd9f",
//       "eeeb023d-18f4-423e-99b9-8d25667671e2",
//       "00d544b9-bfad-434a-acd9-f2bd7a93f6f8"
//     ],
//     "windowsGroupAccountMembershipIds": [],
//     "validUntil": "2018-09-14T17:15:37.247Z",
//     "__classType": "dundas.session.Session"
//   }
// ]
//# sourceMappingURL=dundasSessionProvider.spec.js.map