import React from 'react'
import { useState } from 'react';

export function ItemCard(
    {
        imgSrc,
        key,
        onMintClick,
        itemName,
        description,
        price,
        buttonText,
        showButton,
        onAlternativeClick,
        showAlternativeButton,
        alternativeButtonText,
    }
) 
{
    const [buttonClicked, setButtonClicked] = useState(false);

    const handleButtonClick = async () => {
        setButtonClicked(true); // Update state to indicate button clicked
        try {
          await onMintClick(); // Call the original click handler function
        } catch (err) {
          alert(err); // Handle errors if any
        }
      };

      const handleAlternativeButtonClick = async () => {
        setButtonClicked(true); // Update state to indicate button clicked
        try {
          await onAlternativeClick(); // Call the original alternative click handler function
        } catch (err) {
          alert(err); // Handle errors if any
        }
      };

    return(
        <div className=" flex-col w-[10rem] bg-slate-200 rounded-xl pb-2 shadow-lg border-2 hover:scale-105 duration-250 transition ease-in-out delay-75">
            <img className = " w-[250px] rounded-t-xl "
              src={imgSrc}
              key={key}
              alt= "Product Image"
              border={2}
            />
            <h1 className=" font-bold text-lg p-2 text-center truncate"> {itemName} </h1>
            
            <p className=" text-wrap text-center px-1 text-[15px]/[17px]  text-gray-600">
                {description} <br />
                Price: {price}
                { !buttonClicked && showButton && <button
                className="px-4 py-1 rounded-md bg-orange-700 text-white hover:bg-slate-800 w-full "
                //   disabled = {isMinting}
                onClick={ handleButtonClick }
                >
                {buttonText}

                </button> }{ !buttonClicked && showAlternativeButton && <button
                className="px-4 py-1 rounded-md bg-orange-700 text-white hover:bg-slate-800 w-full "
                //   disabled = {isMinting}
                onClick={ handleAlternativeButtonClick }
                >
                {alternativeButtonText}
                </button> }
            </p>
        </div>
    )
}