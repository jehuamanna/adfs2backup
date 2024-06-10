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


console.log(parseJwt("eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ino2N1Z2TzJQbFE0cEVxYTlIcmluYmozUUtKMCJ9.eyJhdWQiOiJtaWNyb3NvZnQ6aWRlbnRpdHlzZXJ2ZXI6N2NhMGRhNWMtN2JlZi00ZmIwLWIzN2QtN2U4NzZjZWQ0NTk3IiwiaXNzIjoiaHR0cDovL29uZWFjY2Vzcy5kdGRjLmNvbS9hZGZzL3NlcnZpY2VzL3RydXN0IiwiaWF0IjoxNzE4MDA5NTIwLCJleHAiOjE3MTgwMTMxMjAsInN1YiI6Im5pdmV1czFAZHRkYy5jb20iLCJFbXBjb2RlIjoibml2ZXVzMSIsImFwcHR5cGUiOiJDb25maWRlbnRpYWwiLCJhcHBpZCI6IjdjYTBkYTVjLTdiZWYtNGZiMC1iMzdkLTdlODc2Y2VkNDU5NyIsImF1dGhtZXRob2QiOiJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YWM6Y2xhc3NlczpQYXNzd29yZFByb3RlY3RlZFRyYW5zcG9ydCIsImF1dGhfdGltZSI6IjIwMjQtMDYtMTBUMDg6NTI6MDAuMTQzWiIsInZlciI6IjEuMCIsInNjcCI6Im9wZW5pZCJ9.ORURgBTtg7qaNzQhfAfKGxsxvIOWFTbKxYaBJLc-SHZnDqaJt-oI3CLXf1aFzj-XMhDXBCXJbM40DpTfjgRQNiNuu00dCVwZmL3NTsHwgJLquTuTitITcWMhGFWCKS89X8l0CjHJZjPZVyo3jU9Qttphf0IEmeMdFknw-_mNj2h3T2vsnwUH9q8ybR9zfT_nJvYNMgjNLhsSUUwpEZfKuQk4EQe1d0pJLZtSwjrQAPEcMuIDqhgZXKQRJ674M9hewuE3c1yhAxrq9qu4xyvJovMBobvNtC4qc7ekIisPuF7-b5BxdTD1tcHGOWYwZxRt8QDy7pOnFmyZWmI80W3zQw").Empcode);
