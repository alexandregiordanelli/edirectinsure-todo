import { Form } from './Form';
import { ProjectItem } from './ProjectItem';
export const Projects = props => <>
    <ul className="flex-container">
        <li className="flex-item"><Form type="project" /></li>
        {props.projects?.map((x, i) => <li className="flex-item"><ProjectItem key={i} {...x} /></li>)}
    </ul>
    <style jsx>{`
    .flex-container {
        padding: 0;
        margin: 0;
        list-style: none;
        display: flex;
        flex-wrap: wrap;
    }    
    .flex-item{
        background: tomato;
        width: calc(33% - 18px);
        margin: 10px;
        color: white;
    }
    `}</style>
</>;
