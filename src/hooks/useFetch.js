import React, { useState } from "react";
import ReactDOM from "react-dom";
/**
 *
 * @param {*} requestConfig an object containing the fetch URL and an object that tweaks fetch()'s actions. We'll need to make GET and POST requests with it
 */
const useFetch = (requestConfig, applyDataFN, errorFN = () => {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = async (taskText) => {
    setIsLoading(true);
    setError(null);
    try {
      // Grab JSON data from Firebase back end
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : "GET",
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
        /* CREATED FLEXIBLY: The config object will make fetch() perform a GET request 
        ... if we don't specify certain things */
      });
      if (!response.ok) throw new Error("Request failed!");
      const data = await response.json();
      // CASE: Success
      applyDataFN(data); // apply component-specific success function
    } catch (err) {
      errorFN(err); // apply component-specific failure function
      setError(err.message || "Something went wrong!");
    }

    setIsLoading(false);
  };
  // Give components using this hook access to...
  // error/loading states + sendRequest function
  return { isLoading, error, sendRequest };
};
export default useFetch;

/*
const useFetch = (url, options, errorMessage) => {
  const [response, setResponse] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Define the asyncF within useEffect to avoid a soft error
    const fetchData = async () => {
      try {
        // Fetch, throw error if its a bad request, parse data with JSON
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(errorMessage); 
        const json = await res.json();
        // Set the stateful response variable equal to the parsed JSON data
        setResponse(json);
      } catch (errorObj) {
        // Update the stateful error object with our error object
        setError(errorObj); 
      }
    };
    // Call asyncF immediately
    fetchData();
  }, []); 

  return { response, error };
};
*/
