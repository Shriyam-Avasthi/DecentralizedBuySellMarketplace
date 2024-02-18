// Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// contract ListedProduct is ERC721URIStorage, Ownable {

//     uint256 private _tokenIds = 0;
//     uint256 private _totalMinted = 0;
//     mapping(address => uint8) private mintedAddress;    // { address => numberOfTokensMinted }
//     mapping(string => uint8) private URIMapping;        // { URI => hasBeenCollected? }
//     string[]  private tokenURIs;
//     uint256 public price = 0.01 ether;


//     constructor() ERC721("ListedProduct", "NFT") Ownable(msg.sender) 
//     {}

//     function setPrice(uint256 _price) external onlyOwner{
//         price = _price;
//     }

//     function addTokenURI( string memory _tokenURI ) external returns( uint )
//     {
//         tokenURIs.push(_tokenURI);
//         return( tokenURIs.length - 1 );
//     }

//     function mintNFT( string memory tokenURI, address owner )
//         payable
//         external
//         returns (uint256)
//     {
//         require(price <= msg.value, "Ether paid is incorrect");
//         // require(URIMapping[tokenURI] == 0, "This NFT has already been minted");
//         URIMapping[tokenURI] += 1;
//         mintedAddress[msg.sender] += 1;

//         uint256 newItemId = _tokenIds;
//         _mint(owner, newItemId);
//         _setTokenURI(newItemId, tokenURI);

//         _tokenIds++;
//         _totalMinted++;
//         return newItemId;
//     }

//     function withdrawMoney() external onlyOwner{
//         address payable to = payable(msg.sender);
//         to.transfer(address(this).balance);
//     }

//     function GetAvailableNFTs() external view returns ( string[] memory )
//     {
//         return tokenURIs;
//     }
// }

contract Gallery is ERC721URIStorage, Ownable
{
    constructor() ERC721("Marketplace", "NFT") Ownable(msg.sender) 
    {}

    uint256 currentTokenID = 0;

    struct ListedProduct
    {
        address owner;
        address buyer;
        uint price;
        uint tokenID;
        string productMetadataURI;
        bool isMinted;
        bool isMoneyCollected;
        bool recieved;
        bool cancelled;
    }


    ListedProduct[] public listedProducts;
    mapping( string => uint ) private uri_buyerMap;   // TokenURI => collectionId
 
    uint currentCollectionId = 0;

    function AddProduct( string memory _productMetadataURI, uint price ) external
    {
        ListedProduct memory newProduct = ListedProduct( msg.sender, address(0), price ,currentTokenID++, _productMetadataURI, false, false, false,false );
        listedProducts.push(newProduct);
        // tok_collectionMap[_productMetadataURI] = currentCollectionId;
    }

    function GetAvailableProducts() external view returns ( string[] memory )
    {
        string[] memory productURIs = new string[](listedProducts.length);
        
        for (uint i = 0; i < listedProducts.length; i++) {
            if( !listedProducts[i].isMinted )
            {
                productURIs[i] = listedProducts[i].productMetadataURI;
            }
            else
            {
                productURIs[i] = "";
            }
        }
        return productURIs;
        // collections[0].GetAvailableNFTs();
    }

    function GetProductsListedBySender() external view returns ( string[] memory, bool[] memory, bool[] memory, bool[] memory, bool[] memory )
    {
        // uint totalLength = 0;
        // for (uint i = 0; i < collections.length; i++) {
        //     totalLength += collections[i].GetAvailableNFTs().length;
        // }

        string[] memory products = new string[](listedProducts.length);
        bool[] memory isMinted = new bool[](listedProducts.length);
        bool[] memory recieved = new bool[](listedProducts.length);
        bool[] memory cancelled = new bool[](listedProducts.length);
        bool[] memory collected = new bool[](listedProducts.length);
        // uint currentIndex = 0;
        
        for (uint i = 0; i < listedProducts.length; i++) {
            if( listedProducts[i].owner == msg.sender && !listedProducts[i].isMoneyCollected )
            {
                products[i] = listedProducts[i].productMetadataURI;
                isMinted[i] = listedProducts[i].isMinted;
                recieved[i] = listedProducts[i].recieved;
                cancelled[i] = listedProducts[i].cancelled;
                collected[i] = listedProducts[i].isMoneyCollected;
            }
            else
            {
                products[i] = "";
                isMinted[i] = false;
                recieved[i] = false;
                cancelled[i] = false;
                collected[i] = false;
            }
        }
        return (products,isMinted,recieved,cancelled,collected);
        // collections[0].GetAvailableNFTs();
    }
    
    function GetProductsBoughtBySender() external view returns ( string[] memory, bool[] memory, bool[] memory, bool[] memory )
    {
        // uint totalLength = 0;
        // for (uint i = 0; i < collections.length; i++) {
        //     totalLength += collections[i].GetAvailableNFTs().length;
        // }

        string[] memory products = new string[](listedProducts.length);
        bool[] memory isMinted = new bool[](listedProducts.length);
        bool[] memory recieved = new bool[](listedProducts.length);
        bool[] memory cancelled = new bool[](listedProducts.length);
        // uint currentIndex = 0;
        
        for (uint i = 0; i < listedProducts.length; i++) {
            if( listedProducts[i].buyer == msg.sender && !listedProducts[i].isMoneyCollected )
            {
                products[i] = listedProducts[i].productMetadataURI;
                isMinted[i] = listedProducts[i].isMinted;
                recieved[i] = listedProducts[i].recieved;
                cancelled[i] = listedProducts[i].cancelled;
            }
            else
            {
                products[i] = "";
                isMinted[i] = false;
                recieved[i] = false;
                cancelled[i] = false;
            }
        }
        return (products,isMinted,recieved,cancelled);
        // collections[0].GetAvailableNFTs();
    }

    function mintNFT( string memory tokenURI)
        payable
        external

    {
        uint index = 0;
        for( uint i = 0; i < listedProducts.length; i++)
        {
            if( keccak256(abi.encodePacked(listedProducts[i].productMetadataURI)) == keccak256(abi.encodePacked(tokenURI)) )
            {
                console.log("W");
                index = i;
                break;
            }
        }
        
        // require(price <= msg.value, "Ether paid is incorrect");
        // require(URIMapping[tokenURI] == 0, "This NFT has already been minted");
        // URIMapping[tokenURI] += 1;
        // mintedAddress[msg.sender] += 1
        listedProducts[index].isMinted = true;
        listedProducts[index].buyer = msg.sender;

        _mint(msg.sender, listedProducts[index].tokenID);
        _setTokenURI(listedProducts[index].tokenID, tokenURI);

    }

    function ProductRecieved( string memory uri ) external
    {
        for( uint i = 0; i < listedProducts.length; i++)
        {
            if( keccak256(abi.encodePacked(listedProducts[i].productMetadataURI)) == keccak256(abi.encodePacked(uri)) )
            {
                console.log("Z");
                listedProducts[i].recieved = true;
                break;
            }
        }
    }

    function ProductCancelled( string memory uri ) external 
    {
        for( uint i = 0; i < listedProducts.length; i++)
        {
            if( keccak256(abi.encodePacked(listedProducts[i].productMetadataURI)) == keccak256(abi.encodePacked(uri)) )
            {
                console.log("A");
                listedProducts[i].recieved = false;
                listedProducts[i].cancelled = true;
                break;
            }
        }
    }

    function collectMoney( string memory uri ) external 
    {
        for( uint i = 0; i < listedProducts.length; i++)
        {
            if( keccak256(abi.encodePacked(listedProducts[i].productMetadataURI)) == keccak256(abi.encodePacked(uri)) )
            {
                console.log("B");
                require( listedProducts[i].recieved );
                listedProducts[i].isMoneyCollected = true;
                (bool s, ) = msg.sender.call{value : listedProducts[i].price }("");
                require(s);
                break;
            }
        }
    }

    function cancelTransaction( string memory uri ) external
    {
        for( uint i = 0; i < listedProducts.length; i++)
        {
            if( keccak256(abi.encodePacked(listedProducts[i].productMetadataURI)) == keccak256(abi.encodePacked(uri)) )
            {
                console.log("C");
                listedProducts[i].isMoneyCollected = true;
                (bool s, ) = listedProducts[i].buyer.call{value : listedProducts[i].price}("");
                require(s);
                break;
            }
        }
    }

}