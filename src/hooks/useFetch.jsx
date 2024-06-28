import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url, dependecie) => {
    const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url,dependecie]);
  return { data, loading, error };
 
}

export default useFetch