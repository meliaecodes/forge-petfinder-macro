import Resolver from '@forge/resolver';
import {fetch} from '@forge/api';

const getToken = async () => {
    // as the petfinder token only lasts an hour, I'm not going to store it, as I'm
    // confident that the operation to store and retrieve it from forge storage is not worth it

    console.debug("requesting access Token");

    const response = await fetch("https://api.petfinder.com/v2/oauth2/token", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + process.env.PETFINDER_CLIENTID + '&client_secret=' + process.env.PETFINDER_CLIENTSECRET
    });

    // TODO check if response is ok and log error if not!

    const token = await response.json()
    console.debug(token);

  return token;
}

const resolver = new Resolver();

resolver.define('getAnimals', async (req) => {
  const url = "https://api.petfinder.com/v2/";
  let urlOptions = "limit=15";

  console.debug("getAnimals")
  console.debug(req);

  if(req.context.extension.config) {
    // modify the options for the fetch call based on the config the user has set. 
    console.debug("macro config set")
    console.debug(req.context.extension.config)

    const petOptions = req.context.extension.config

    // petType
    if (petOptions.petType) {
      if (petOptions.petType != 'all') {
        urlOptions = urlOptions.concat("&type="+petOptions.petType);
      }
    }

    // zipCode

    if(petOptions.zipCode) {
      urlOptions = urlOptions.concat("&location="+petOptions.zipCode+"&sort=distance");
    }

    // age
    if(petOptions.age) {
      urlOptions = urlOptions.concat("&age="+petOptions.age.toString());
    }

    // size
    if(petOptions.size) {
      urlOptions = urlOptions.concat("&size="+petOptions.size.toString());
    }

    // gender
    if(petOptions.gender) {
      urlOptions = urlOptions.concat("&gender="+petOptions.gender.toString());
    }

    // other
    if(petOptions.other){
      petOptions.other.forEach(n => {urlOptions = urlOptions.concat("&"+n+"=true")})
      
    }


  } else {
    console.debug("macro config not set")
  }

  const requestToken = await getToken();

  const response = await fetch(url + "animals?" + urlOptions, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + requestToken.access_token
    }
  });
  
    console.debug(response);

    // do something if the response is an error

    const animals = await response.json();
    return animals;
  
});

export const handler = resolver.getDefinitions();
