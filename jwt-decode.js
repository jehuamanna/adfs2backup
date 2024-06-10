function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function atob(s) {
    return Buffer.from(s, "base64").toString()
}


console.log(parseJwt("eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ino2N1Z2TzJQbFE0cEVxYTlIcmluYmozUUtKMCJ9.eyJhdWQiOiJtaWNyb3NvZnQ6aWRlbnRpdHlzZXJ2ZXI6N2NhMGRhNWMtN2JlZi00ZmIwLWIzN2QtN2U4NzZjZWQ0NTk3IiwiaXNzIjoiaHR0cDovL29uZWFjY2Vzcy5kdGRjLmNvbS9hZGZzL3NlcnZpY2VzL3RydXN0IiwiaWF0IjoxNzE4MDEyMTc4LCJleHAiOjE3MTgwMTU3NzgsInN1YiI6InVkYXkucGFuZGFAZHRkYy5jb20iLCJFbXBsb3llZS1JRCI6IkMyMTM4NyIsIkVtcGNvZGUiOiJDMjEzODciLCJhcHB0eXBlIjoiQ29uZmlkZW50aWFsIiwiYXBwaWQiOiI3Y2EwZGE1Yy03YmVmLTRmYjAtYjM3ZC03ZTg3NmNlZDQ1OTciLCJhdXRobWV0aG9kIjoidXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFjOmNsYXNzZXM6UGFzc3dvcmRQcm90ZWN0ZWRUcmFuc3BvcnQiLCJhdXRoX3RpbWUiOiIyMDI0LTA2LTEwVDA5OjM2OjE4LjQ2OFoiLCJ2ZXIiOiIxLjAiLCJzY3AiOiJvcGVuaWQifQ.bhhZb1-5NU54HbTzhCdSQ-a_EwJ7hRbYrjSpjwRdhSpBxUXWfnZ_7ITkP5xTJqBjK5cfG3y4R0JiHE5IvQjeCQWCX6L_4hr-2W_TA3YfmDDhUqllLaSc79ms4f06udExi22TRKur5WaqKUIZUticx_egUrVRG1vBGNqB23SmTh9AHAhQ6949FtPjSM5lkjuR4Hl7Pzht1jShdoFM3xPxtpZEoFvtxSKcyF8YkQHLXold-BvKofquoLaqwGrO5qnOKPcKPVk0tQ0gbLp7Pl7tPH5FNBBkHI_Vms7KL6gdF-MlPSEwIgtTkT2-Xivgb0HcddzgpLCvF8EdN5x6-Sk_eQ").Empcode);
