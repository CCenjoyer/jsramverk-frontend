import { useParams } from 'react-router-dom';
import FetchDoc from "../Api/FetchDoc.jsx";

function Update() {
    const { id } = useParams();

  return (
    <div>
      <h1>Edit Entry {id}</h1>
      <FetchDoc />
    </div>
  );
}

export default Update;
