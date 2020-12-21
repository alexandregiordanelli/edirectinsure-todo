import { useStateValue } from './State';
import { Header } from './Header';
import { Projects } from './Projects';

export const UserPage = () => {
    const [state, dispatch] = useStateValue();

    if (state.user) {
        return (
            <>
                <style jsx global>{`
                    *{
                        font-size: 14px;
                        line-height: 30px;
                        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto, Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue, sans-serif;
                    }
               body{
                   margin: 0;
                   padding: 0;
               }
                `}</style>
                <Header dispatch={dispatch} email={state.user.email} />

                <Projects projects={state.projects} />


            </>
        );
    } return null;
};
