import { useParams } from 'react-router-dom';
import CreateDoc from '../Api/CreateDoc';

function Create() {
    return (
        <div>
            <h1>Create a New Document</h1>
            <CreateDoc />
        </div>
    );
}

export default Create;
