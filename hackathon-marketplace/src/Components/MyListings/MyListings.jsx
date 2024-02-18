import React from 'react'
import { Contract, ethers } from "ethers";
import { useEffect, useState, useContext } from "react";
import contractABI from "../../contractABI.json"
import context from "../../Context/context";
import { ItemCard } from "../Cards/ItemCard";

function MyListings() 
{
    const {NFTContract,setNFTContract} = useContext(context);
    const [ data, setData ] = useState([]);
  
    async function fetchData(metaURL) {
        const response = await fetch(metaURL);
        const fetchedData = await response.json();
        return ( fetchedData );
    }
  
    useEffect( () => {
        async function getData()
        {
          if( NFTContract !== null  )
          {
            if ( NFTContract.signer._address !== null )
            {
              console.log("GETTING>>>>>>>")
              const [uris,isMinted,recieved,cancelled,collected] = await NFTContract.GetProductsListedBySender();
              console.log(cancelled);
              const _data = [];
              let count = 0;
              for (const uri of uris) {
                if( uri === "" ) continue;
                const fetchedData = await fetchData("https://gateway.pinata.cloud/ipfs/" + uri);
                const imgSrc = "https://gateway.pinata.cloud/ipfs/" + fetchedData.image.slice(7) 
                console.log(fetchedData)
                _data.push({
                  url: imgSrc,
                  param: uri,
                  name: fetchedData.name,
                  description: fetchedData.description,
                  price: fetchedData.price + " MATIC",
                  isMinted: isMinted[count],
                  recieved: recieved[count],
                  cancelled: cancelled[count],
                  collected: collected[count],
                });
                count++;
              }
              console.log( _data[0])
              setData(_data);
              // console.log( uris );
            }
          }
        }
        
        console.log("getting");
        setTimeout(() => { getData() }, 3000);
        console.log(data);
      },[NFTContract])
    
      async function handleMoneyCollection(uri) {
        try {
          const response = await NFTContract.collectMoney( uri, { gasLimit: ethers.BigNumber.from("100000"), gasPrice: ethers.utils.parseUnits("5", "gwei")} );
          console.log("Received: ", response);
        } catch (err) {
          alert(err);
        }
      }

      async function handleCancellation(uri) {
        try {
          const response = await NFTContract.cancelTransaction( uri, { gasLimit: ethers.BigNumber.from("100000"), gasPrice: ethers.utils.parseUnits("5", "gwei")} );
          console.log("Received: ", response);
        } catch (err) {
          alert(err);
        }
      }
    
    return (
        <div className="bg-auto bg-slate-300 min-h-svh">
        <>
          <div className="container">
            {data.map((item, index) => (
              <div className="imgDiv">
                { item.cancelled ? 
                <ItemCard imgSrc={item.url} key={index} 
                itemName = {item.name}
                description = {item.description}
                price = {item.price}
                buttonText = "Confirm Cancellation"
                showButton={ !item.collected }
                onMintClick={() => {
                    handleCancellation( item.param );
                  }}/>
                
                :
                
                <ItemCard imgSrc={item.url} key={index} 
                itemName = {item.name}
                description = {item.description}
                price = {item.price}
                buttonText = "Collect Money"
                showButton={item.recieved && !item.collected}
                onMintClick={() => {
                    handleMoneyCollection( item.param );
                  }}/>

                }

              
              </div>
            ))}
            
            </div>
        </>
        
        </div>
        
      );
}

export default MyListings