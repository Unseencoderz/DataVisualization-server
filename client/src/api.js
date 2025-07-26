export const fetchData = async () => {
    try {
      const response = await fetch('https://datavisualization-server.onrender.com/api/data');
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };
  