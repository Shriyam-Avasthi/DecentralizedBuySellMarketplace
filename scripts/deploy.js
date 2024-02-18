async function main() {
    const Gallery = await ethers.getContractFactory("Gallery");
    const gallery = await Gallery.deploy();
    await gallery.deployed();
    console.log("Contract deployed to address:", gallery.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    }
);