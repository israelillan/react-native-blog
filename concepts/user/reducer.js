import * as names from './names'
import INTIAL_STATE from './state'

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case names.USER_DATA:
      // Object {
      //   "_redirectEventId": undefined,
      //   "apiKey": "AIzaSyBbHTCbQKkjbtB9jt41XorpD5KudqsR8m4",
      //   "appName": "[DEFAULT]",
      //   "createdAt": "1636618656360",
      //   "displayName": undefined,
      //   "email": "israelillan@gmail.com",
      //   "emailVerified": true,
      //   "isAnonymous": false,
      //   "lastLoginAt": "1636714733317",
      //   "phoneNumber": undefined,
      //   "photoURL": undefined,
      //   "providerData": Array [
      //     Object {
      //       "displayName": null,
      //       "email": "israelillan@gmail.com",
      //       "phoneNumber": null,
      //       "photoURL": null,
      //       "providerId": "password",
      //       "uid": "israelillan@gmail.com",
      //     },
      //   ],
      //   "stsTokenManager": Object {
      //     "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImY1NWUyOTRlZWRjMTY3Y2Q5N2JiNWE4MTliYmY3OTA2MzZmMTIzN2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcmVhY3QtbmF0aXZlLWJsb2ctMTIzM2IiLCJhdWQiOiJyZWFjdC1uYXRpdmUtYmxvZy0xMjMzYiIsImF1dGhfdGltZSI6MTYzNjcxNDg0NCwidXNlcl9pZCI6IjV4UkRseGpmbm5ZZnZac0taWXpubWtqemNVcjEiLCJzdWIiOiI1eFJEbHhqZm5uWWZ2WnNLWll6bm1ranpjVXIxIiwiaWF0IjoxNjM2NzE0ODQ0LCJleHAiOjE2MzY3MTg0NDQsImVtYWlsIjoiaXNyYWVsaWxsYW5AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiaXNyYWVsaWxsYW5AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.CMu4-543Qkh6CgGdOr-JooNqv0FJaDQSK628Rh5OsQ7BIkbXrm7fWSKfQdrvgR-oLo1I8c5sqC6c-GiR2dRQhKxNxlUVr76fZSPSx8Ta5i8Dg0OBj6oYAj-5Snb0QZCs9zgq-8s8tdQBU1PFZ0x2zHzhedif66AeA5YVt5xJYsBdfn9_N_X3gI5DSDDdUJdNEF2h3pXPQQML7THTmP6Ij2Ah6schygJOJj7Hnmrecgt80p02rixNMluwwQcCzQUQ2oSEgW11HI2KU0KOca23kRg3eA6GSb4_sMd__rANANgpPwaQXZfn44oaw9kRS8o2YauuVBqhzumfCPLxBz_DJg",
      //     "expirationTime": 1636718444800,
      //     "refreshToken": "AFxQ4_qbiVUXtZ4QsK3WezTJ_e9Nh9knEhBV7SbakGK0CNRL9PQ0UzK2SoJdad5w72GunTq2fBRbJjGIcD5ofsWavW7Sc8AMQYJr3m39qhZkCjMT1puxjAFtmxwQuXN_NT-dgKBlrVUY3sVWsew5BIfVngORntzMHcBHbhT25kzIDGpToStjepVgTzI0FkG61ZjXo8A0IffI7ARkZcyVFubd9uDOhNdNX05ZxHLBgG8bYDeCc8d2L6A",
      //   },
      //   "tenantId": undefined,
      //   "uid": "5xRDlxjfnnYfvZsKZYznmkjzcUr1",
      // }
      return {
        ...state,
        id: !!action.userData ? action.userData.uid : null,
        loggedIn: !!action.userData && !action.userData.isAnonymous,
        loggedInAndEmailVerified: !!action.userData && !action.userData.isAnonymous && action.userData.emailVerified
      };
    case names.LOGOUT:
      return INTIAL_STATE;
    default:
      return state;
  }
};
