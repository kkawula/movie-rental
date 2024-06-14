import { useState } from "react";
import { useEffect } from "react";

export default function Clients() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    useEffect(() => {
      // Replace with your API endpoint
      const apiUrl = 'http://localhost:3001/users';
  
      const fetchData = async () => {
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const jsonData = await response.json();
          setData(jsonData);
          setLoading(false);
        } catch (error) {
          setError((error as Error).message);
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // TODO
    return (
        <div>{data ? String(data.map((d) => d.first_name + " " + d.last_name)) : ""}</div>
    )
}