const getJsonData = (jsonPath, setCallback) => {
  fetch(
      jsonPath,
      {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )
    .then(function(response){
      return response.json()
    })
    .then(function(myJson) {
      setCallback(myJson)
    });
}

export {getJsonData}