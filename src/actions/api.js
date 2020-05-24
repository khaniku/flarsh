const url = "http://localhost:3000"

export function login(phoneNumber){
    return fetch(url+"/auth/login", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
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

export function signup(user){
    return fetch(url+"/auth/signup", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: user.phoneNumber,
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email
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