import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PathwayDetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [pathway, setPathway] = useState(null);

  useEffect(() => {
    if (user) {
      axios
        .get(`/api/pathways/${id}`)
        .then((res) => {
          setPathway(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user, id]);

  if (!pathway) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold">{pathway.title}</h2>
      <p>{pathway.description}</p>
      <ul>
        {pathway.items.map((item) => (
          <li key={item._id}>{item.type}</li>
        ))}
      </ul>
    </div>
  );
};

export default PathwayDetail;
