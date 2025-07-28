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
    return <Loading />;
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">{pathway.title}</h2>
      <p className="mb-4">{pathway.description}</p>
      <h3 className="text-xl font-semibold mb-3">Items</h3>
      <ul>
        {pathway.items.map((item) => (
          <li key={item._id} className="py-1 border-b border-neutral-border last:border-b-0">
            {item.type}: {item.content}
          </li>
        ))}
      </ul>
      <Link to={`/pathways/${pathway._id}/edit`} className="btn btn-secondary mt-4">Edit Pathway</Link>
    </div>
  );
};

export default PathwayDetail;
