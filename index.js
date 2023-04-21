export const contractAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
export const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "priceFeed",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "FundMe__NotOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "MINIMUM_USD",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "cheaperWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "fund",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "fundingAddress",
        type: "address",
      },
    ],
    name: "getAddressToAmountFunded",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getFunder",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPriceFeed",
    outputs: [
      {
        internalType: "contract AggregatorV3Interface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVersion",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const connectionButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const getBalanceButton = document.getElementById("getBalance");
const withdrawButton = document.getElementById("withdraw");
connectionButton.onclick = function () {
  connect();
};
fundButton.onclick = function () {
  fund();
};
getBalanceButton.onclick = function () {
  getBalance();
};
withdrawButton.onclick = function () {
  withdraw();
};

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectionButton.innerHTML = "Connected";
  } else {
    document.getElementById("connectButton").innerHTML = "Get Metamask";
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    console.log("Withdrawing...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = await new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.withdraw();
      await listenForFunction(transactionResponse, provider);
      console.log("Done!");
    } catch (error) {
      console.log(error);
    }
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log("Funded with " + ethAmount);
  if (typeof window.ethereum !== "undefined") {
    console.log(ethers);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = await new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });

      await listenForFunction(transactionResponse, provider);
      console.log("Done!");
    } catch (error) {
      console.log(error);
    }
  }

  function listenForFunction(transactionResponse, provider) {
    console.log("Mining " + transactionResponse.hash + "...");

    return new Promise((resolve, reject) => {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          "Completed with " +
            transactionReceipt.confirmations +
            " confrimations"
        );
        resolve();
      });
    });
  }
}
