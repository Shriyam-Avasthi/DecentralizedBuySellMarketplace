import React, {useState} from 'react'

import context from './context'

const ContextProvider = ( {children} )=> {
    const [NFTContract,setNFTContract] = useState(null);
    return(
        <context.Provider value={{NFTContract,setNFTContract}}> 
            {children}
        </context.Provider>
    )
}

export default ContextProvider