import "./home.css";
import { Contract, ethers } from "ethers";
import { useEffect, useState, useContext } from "react";
import contractABI from "../../contractABI.json"
import context from "../../Context/context";
import { ItemCard } from "../Cards/ItemCard";

const contractAddress = "0xDBb73d1a9B41d54486b8fDa3be8020D5E78A0B85";

export default function Home() {

  const {NFTContract,setNFTContract} = useContext(context);
  
  const [account, setAccount] = useState(null);
  const [ data, setData ] = useState([]);
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);

  // state for whether app is minting or not.
  const [isMinting, setIsMinting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false); // Added state for network check

  // Check if the current network is the correct network
  useEffect(() => {
    async function checkNetwork() {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        setIsCorrectNetwork(chainId === "0x13881"); // Change to the correct chain ID
      }
    }
    //check for initial network
    checkNetwork();

    //Check for network change
    window.ethereum.on("chainChanged", (newChainId) => {
      setIsCorrectNetwork(newChainId === "0x13881"); // Change to the correct chain ID
    },[]);
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
  }, []);

  useEffect( () => {
    async function initNFTContract() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner(account);
      setNFTContract(new Contract(contractAddress, contractABI.abi, signer));
      // console.log( "USEEFFECT :" , account );
    }
    initNFTContract();
  }, [account]);

  async function connectWallet() {
    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts) => {
        setAccount(accounts[0]);
      })
      .catch((error) => {
        alert("Something went wrong");
      });

  }

  async function disconnectWallet() {
    if (window.ethereum) {
      try {
        setAccount(null);
      } catch (error) {
        console.error("An error occurred while disconnecting the wallet:", error);
      }
    }
  }

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
          const uris = await NFTContract.GetAvailableProducts();
          const _data = [];
          for (const uri of uris) {
            if( uri !== "" )
            {
              const fetchedData = await fetchData("https://gateway.pinata.cloud/ipfs/" + uri);
              const imgSrc = "https://gateway.pinata.cloud/ipfs/" + fetchedData.image.slice(7) 
              console.log(fetchedData)
              _data.push({
                url: imgSrc,
                param: uri,
                name: fetchedData.name,
                description: fetchedData.description,
                price: fetchedData.price,
              });
            }
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


  async function withdrawMoney() {
    try {
      const response = await NFTContract.withdrawMoney();
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    }
  }
  
  if (!isCorrectNetwork) {
    return (
      <div className="container">
        <br />
        <h2>Switch to the Polygon Mumbai Network</h2>
        <p>Please switch to the Polygon Mumbai network to use this app.</p>
      </div>
    );
  }

  async function handleMint(tokenURI, itemPrice) {
    setIsMinting(true);
    try {
      const options = { value: ethers.utils.parseEther(itemPrice) };
      const response = await NFTContract.mintNFT(tokenURI, options);
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    } finally {
      setIsMinting(false);
    }
  }

  if (account === null) {
      return (
        <>
          <div className="bg-slate-300 justify-center text-center content-center bg-auto bg-repeat min-h-svh">
            <div className= "translate-y-8">
              <br />
              <h2 className="text-3xl"> Second Hand Buy and Sell Marketplace</h2>
              <p className="my-2 text-lg">Buy second hand products from nearby people for cheap prices.</p>

              {isWalletInstalled ? (
                <button className="connect-button bg-orange-700 px-2 py-2 rounded-md text-white text-center my-4"
                onClick={connectWallet}>Connect Wallet</button>
                ) : (
                  <p>Install Metamask wallet</p>
                  )}
            </div>
          </div>
        </>
    );
}


  return (
    <div className="bg-auto bg-slate-300 min-h-svh">
    <>
      <div className="container">
        <br />

        <h1 className=" text-3xl">Second Hand Product Marketplace</h1>
        {data.map((item, index) => (
          <div className="imgDiv">
            <ItemCard imgSrc={item.url} key={index} 
            itemName = {item.name}
            description = {item.description}
            price = {item.price + " MATIC"}
            buttonText="Buy"
            showButton={true}
            onMintClick={() => {
                handleMint(item.param, item.price);
              }}/>
            
          </div>
        ))}
        <div className="withdraw_container">
        <button className="my-4 p-2 rounded-md bg-orange-800 text-white hover:bg-slate-950"
          onClick={() => {
            withdrawMoney();
          }}
        >
          Withdraw Money from Contract
        </button>
        </div>
        <button className="disconnect-button" onClick={disconnectWallet}>Disconnect Wallet</button>
      </div>
    </>
    
    </div>
    
  );
}
