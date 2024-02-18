import React from 'react'
import { useState, useContext } from 'react'
import FormData from 'form-data';
import axios from "axios"
import context from '../../Context/context';
import {ethers} from 'ethers'

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_API_Secret
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_Key

export default function Sell() 
{
    const {NFTContract} = useContext(context)
    const [file, setFile] = useState();
    const [ collectionName, setCollectionName ] = useState();
    const [ price, setPrice ] = useState();
    const [description, setDescription ] = useState();
    function handleChange(e) {
        console.log(e.target);
        setFile(URL.createObjectURL(e.target.files[0]));
    }
    
    async function submitNFT()
    {
        if(NFTContract == null)
        {
            console.log("Contract is null");
            return;
        }
        if( NFTContract.signer._address == null)
        {
            console.log("Signer Adress is null");
            return;
        }

        const formData = new FormData();
        let blob = await fetch(file).then(r => r.blob());
            formData.append("file", blob)

        const metadata = JSON.stringify({
            name: collectionName + "_" + blob.name,
        });
        formData.append('pinataMetadata', metadata);
    
        const options = JSON.stringify({
            cidVersion: 0,
        })
        formData.append('pinataOptions', options);
    
        try{
            const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization' : "Bearer "+ PINATA_JWT,
            }
            });
            
            const meta_formData = new FormData();
            const metadata = {
                pinataContent: {
                    name: collectionName,
                    image: "ipfs://" + res.data.IpfsHash,
                    description: description,
                    price: price,
                },
                pinataMetadata: { name: "TEST.json"}
            }
            
            const jsonData = JSON.stringify(metadata)
            const file = new File([jsonData], 'data.json', { type: 'application/json' });

            meta_formData.append('file',file);
            // Object.keys(metadata).forEach( key => {
                // meta_formData.append("file",metadata)
            // })

            const meta = JSON.stringify({
                name: "meta_" + collectionName,
            });
            formData.append('pinataMetadata', metadata);

            try
            {
                const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", jsonData, {
                headers: {
                    'Content-Type': `application/json`,
                    'Authorization' : "Bearer "+ PINATA_JWT,
                }
                });
                // console.log( NFTContract.signer);
                console.log( await NFTContract.AddProduct( res.data.IpfsHash,  ethers.utils.parseEther(price)  ) );

            }
            catch(error)
            {
                console.log(error);
            }
        } 
        catch (error) {
            console.log(error);
        }
    }
 
    return (
        <div className="App grid h-screen  place-content-center bg-slate-300">
            <div className='bg-white grid grid-cols-1 place-content-center px-4 py-4 bg-opacity-50'>
                <h1 className="text-3xl place-self-center">Enter Product Details:</h1>
                <div className='py-3 flex '>
                    <label className=' w-fit me-4 self-center'> Product Title </label> 
                    <input type="text" placeholder="Enter product title..." onChange={ (e) => setCollectionName(e.target.value) } className = "border-black border-opacity-100 border-2 hover:border-orange-500 focus:outline-none focus:border-orange-700 grow rounded-md px-1 py-1 shadow-md" /> <br />
                </div>
                <div className='py-3 flex'>
                    <label className="w-fit me-3 self-center">Price (MATIC) </label>
                    <input type="number" inputMode="numeric" placeholder = "Enter the price..." onChange={ (e) => setPrice(e.target.value) } className = "form-control border-black border-opacity-100 border-2 hover:border-orange-500 focus:outline-none focus:border-orange-700 grow rounded-md px-1 py-1 shadow-md" /> <br />
                </div>
                <div className='py-3 flex'>
                    <label className='w-fit me-4 self-center'>Description <br />(Max 200 characters)</label>
                    <textarea placeholder = "Enter the product description..." rows="2" cols="25" maxLength={200} onChange={ (e) => setDescription(e.target.value) } className = "border-black border-opacity-100 border-2 hover:border-orange-500 focus:outline-none focus:border-orange-700 grow rounded-md px-1 py-1 shadow-md" /> <br />
                </div>
                <div className='py-3'>
                    Upload an image showing your product: 
                </div>
                <input type="file" onChange={handleChange} />
                <img className='px-4 py-4 place-self-center' 
                src={file} height={300} width={300} />
                <button onClick={submitNFT} className='bg-orange-400 border-black m-2 rounded-md px-4 py-1'> 
                    Submit
                </button>
            </div>
        </div>
    );
}
