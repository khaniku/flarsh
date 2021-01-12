const url = "http://localhost:3000"
import axios from 'axios';

export function login(user, client){
    return fetch(url+"/auth/login", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userResp: user,
        client: client
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
        return responseJson;
    })
    .catch((error) => {
        console.log(error);
    });
}

// export function signup(user){
//     return fetch(url+"/auth/signup", {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         phoneNumber: user.phoneNumber,
//         firstname: user.firstName,
//         lastname: user.lastName,
//         email: user.email,
//         userResp: user.userResp,
//         userType: user.userType
//       })
//     })
//     .then((response) => response.json())
//     .then((responseJson) => {
//         console.log(responseJson)
//         return responseJson;
//     })
//     .catch((error) => {
//         console.log(error);
//     });
// }

export const signup = ( user ) => {
  return  axios.post(url+'/auth/signup', {
            phoneNumber: user.phoneNumber,
            firstname: user.firstName,
            lastname: user.lastName,
            email: user.email,
            userResp: user.userResp,
            userType: user.userType
          })
          .then(res => {
          console.log(res)
            return res.data;
          })
          .catch(err => {
            console.log(err.message)
    });
};

export function checkPhoneNumber(phoneNumber){
  return fetch(url+"/auth/phoneNumberExists/"+phoneNumber, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  .then((response) => response.json())
  .then((responseJson) => {
      return responseJson;
  })
  .catch((error) => {
    console.log(error);
  });
}

export function addCard(card, token){
  return fetch(url+"/payment/create", {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify({
       card_number: card.number,
       expiry_date: card.expiry,
       cvv: card.cvc,
       type: card.type,
    })
  })
  .then((response) => response.json())
  .then((responseJson) => {
      console.log(responseJson)
      return responseJson;
  })
  .catch((error) => {
      console.log(error);
  });
}

export function validateRefreshToken(refreshToken){
  return fetch(url+"/auth/validateRefreshToken/"+refreshToken, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  .then((response) => response.json())
  .then((responseJson) => {
      return responseJson;
  })
  .catch((error) => {
    console.log(error);
  });
}

export function getNewToken(refreshToken, apiKey){
  return fetch("https://securetoken.googleapis.com/v1/token?key="+apiKey, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
   })
  })
  .then((response) => response.json())
  .then((responseJson) => {
      console.log(responseJson)
      return responseJson;
  })
  .catch((error) => {
    console.log(error);
  });
}

export function logout(refreshToken){
  return fetch(url+"/auth/logout", {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh_token: refreshToken
   })
  })
  .then((response) => response.json())
  .then((responseJson) => {
      console.log(responseJson)
      return responseJson;
  })
  .catch((error) => {
    console.log(error);
  });
}

export function checkEmail(email){
  return fetch(url+"/auth/emailExists/"+email, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  .then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson)
      return responseJson;
  })
  .catch((error) => {
    console.log(error);
  });
}