import { createContext, useState } from 'react';

export const MyContext = createContext("");


function AppContextProvider({children}){
    
    const [owner,SetOwner]=useState("");
    const[oppountes,SetOppountes]=useState('');
    const[currentUser,SetCurrentUser]=useState('');
    

    const value={
        owner,
        SetOwner,
        oppountes,
        SetOppountes,
        currentUser,
        SetCurrentUser
    };

    return <MyContext.Provider value={value}>

      {children}

    </MyContext.Provider>
}

export default AppContextProvider;