import React from 'react';
import '../App/index.css';
import Amplify from 'aws-amplify';
import AppList from '../App';
import List from '../List';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsConfig from '../../aws-exports';

Amplify.configure(awsConfig);

const App = () => {
	const [authState, setAuthState] = React.useState();
	const [user, setUser] = React.useState();

	React.useEffect(() => {
		return onAuthUIStateChange((nextAuthState, authData) => {
			setAuthState(nextAuthState);
			setUser(authData);
		});
	}, []);

	return authState === AuthState.SignedIn && user ? (
		<AppList  />
	) : (
    <>
    <List />
    </>
	);
};

export default App;
