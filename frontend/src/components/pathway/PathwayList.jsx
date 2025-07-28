import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const PathwayList = ({ projectId }) => {
  const { user } = useContext(AuthContext);
  const [pathways, setPathways] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get(`/api/pathways?project=${projectId}`)
        .then((res) => {
          setPathways(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user, projectId]);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Pathways</h3>
      <div className="card">
        <ul>
          {pathways.map((pathway) => (
            <li key={pathway._id} className="py-2 border-b border-neutral-border last:border-b-0">
              <Link to={`/pathways/${pathway._id}`} className="text-primary hover:underline">
                {pathway.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PathwayList;
