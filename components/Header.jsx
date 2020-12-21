export const Header = props => <>
    <div className="header">
        <h1>{props.email}</h1>
        <button onClick={() => {
            props.dispatch({ type: 'CLEAR_TOKEN' });
            props.dispatch({ type: 'CHANGE_USER', value: null });
            props.dispatch({ type: 'SET_PROJECTS', value: [] });
            props.dispatch({ type: 'SET_TASKS', value: [] });
        }}>sign out</button>
    </div>
    <style jsx>{`
    .header {
        background: black;
        display: flex;
        justify-content: space-between;
    }    
    h1 {
        margin: 0;
        color: white;
    }
    button {
        line-height: 30px;
    }
    `}</style>
</>;
