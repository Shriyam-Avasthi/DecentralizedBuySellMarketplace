import React from 'react'
import { Contract, ethers } from "ethers";
import { useEffect, useState, useContext } from "react";
import contractABI from "../../contractABI.json"
import context from "../../Context/context";
import { ItemCard } from "../Cards/ItemCard";

function MyBuyings() 
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
              const [uris,isMinted,recieved,cancelled] = await NFTContract.GetProductsBoughtBySender();
              console.log(isMinted);
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
                  cancelled: cancelled[count]
                });
                count ++;
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
    
      async function handleRecieved( uri ) {
        try {
          const response = await NFTContract.ProductRecieved( uri );
          console.log("Received: ", response);
        } catch (err) {
          alert(err);
        }
      } 

      async function handleNotRecieved(uri) {
        try {
          console.log(uri);
          const response = await NFTContract.ProductCancelled( uri );
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
                <ItemCard imgSrc={item.url} key={index} 
                itemName = {item.name}
                description = {item.description}
                price = {item.price}
                buttonText = "Recieved"
                showButton={item.isMinted && !(item.recieved || item.cancelled)}
                showAlternativeButton={item.isMinted && !(item.recieved || item.cancelled)}
                alternativeButtonText="Not Recieved"
                onMintClick={() => {
                    handleRecieved( item.param );
                  }}

                onAlternativeClick = {() => {
                    handleNotRecieved( item.param );
                }}/>

              
              </div>
            ))}
            
            </div>
        </>
        
        </div>
        
      );
}

export default MyBuyings